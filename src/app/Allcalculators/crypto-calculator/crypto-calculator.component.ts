import { ChangeDetectionStrategy, Component, OnInit, signal, computed, inject, ViewChild, ElementRef, AfterViewChecked, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

interface FxResponse {
  base: string;
  timestamp: string;
  rates: { [key: string]: number };
}

interface CryptoInfo {
  symbol: string;
  name: string;
}

@Component({
  selector: 'app-crypto-calculator',
  templateUrl: './crypto-calculator.component.html',
  styleUrl: './crypto-calculator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class CryptoCalculatorComponent implements OnInit, AfterViewChecked {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('feeChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  public chartInstance = signal<Chart | null>(null);
  private chartShouldBeCreated = false;

  // Form Inputs
  calcMode = signal<'buy' | 'sell'>('buy'); // Buy (Fiat -> Crypto), Sell (Crypto -> Fiat)
  amount = signal<number | null>(1000);
  selectedCoin = signal<string>('BTC');
  selectedFiat = signal<string>('INR');
  feePercent = signal<number>(1.0); // transaction fee percentage, default 1.0%

  // API States
  rates = signal<{ [key: string]: number }>({});
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Supported Assets
  supportedCoins: CryptoInfo[] = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BNB', name: 'Binance Coin' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'XRP', name: 'Ripple' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'DOGE', name: 'Dogecoin' },
    { symbol: 'LTC', name: 'Litecoin' },
    { symbol: 'AVAX', name: 'Avalanche' },
    { symbol: 'LINK', name: 'Chainlink' },
    { symbol: 'TRX', name: 'TRON' }
  ];

  supportedFiats = [
    { symbol: 'INR', name: 'Indian Rupee', prefix: '₹' },
    { symbol: 'USD', name: 'US Dollar', prefix: '$' },
    { symbol: 'EUR', name: 'Euro', prefix: '€' },
    { symbol: 'GBP', name: 'British Pound', prefix: '£' }
  ];

  // Validation
  validationError = signal<string>('');

  // Computed Properties for rates
  fiatSymbol = computed(() => {
    const selected = this.selectedFiat();
    const found = this.supportedFiats.find(f => f.symbol === selected);
    return found ? found.prefix : '';
  });

  // Spot price of 1 selected coin in the selected fiat currency
  coinPriceInFiat = computed(() => {
    const coin = this.selectedCoin();
    const fiat = this.selectedFiat();
    const rateList = this.rates();

    if (!rateList || !rateList[coin] || !rateList[fiat]) return null;

    // Rates are based in USD.
    // 1 USD = rateList[coin] coins -> 1 coin = 1 / rateList[coin] USD
    // 1 USD = rateList[fiat] fiat -> 1 USD in fiat = rateList[fiat]
    // Therefore, 1 coin in fiat = (1 / rateList[coin]) * rateList[fiat]
    const coinPriceInUsd = 1 / rateList[coin];
    return coinPriceInUsd * rateList[fiat];
  });

  // Outputs of calculation
  calculations = computed(() => {
    const mode = this.calcMode();
    const amt = this.amount();
    const price = this.coinPriceInFiat();
    const feeRate = this.feePercent();

    if (amt === null || amt <= 0 || !price) {
      return null;
    }

    const feeMultiplier = feeRate / 100;

    if (mode === 'buy') {
      // Fiat to Crypto
      // User invests `amt` fiat.
      const feeAmountFiat = amt * feeMultiplier;
      const netInvestmentFiat = amt - feeAmountFiat;
      const cryptoReceived = netInvestmentFiat / price;

      return {
        gross: amt,
        fee: feeAmountFiat,
        net: netInvestmentFiat,
        result: cryptoReceived,
        resultLabel: 'Crypto Received',
        resultUnit: this.selectedCoin(),
        fiatFee: feeAmountFiat
      };
    } else {
      // Crypto to Fiat
      // User sells `amt` crypto.
      const grossFiatValue = amt * price;
      const feeAmountFiat = grossFiatValue * feeMultiplier;
      const netPayoutFiat = grossFiatValue - feeAmountFiat;

      return {
        gross: grossFiatValue,
        fee: feeAmountFiat,
        net: netPayoutFiat,
        result: netPayoutFiat,
        resultLabel: 'Net Payout',
        resultUnit: this.selectedFiat(),
        fiatFee: feeAmountFiat
      };
    }
  });

  ngOnInit() {
    this.fetchUsdRates();
  }

  ngAfterViewChecked() {
    if (this.chartShouldBeCreated && this.chartRef?.nativeElement) {
      this.createChart();
      this.chartShouldBeCreated = false;
    }
  }

  fetchUsdRates() {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');

    const url = 'https://fxapi.app/api/usd.json';

    this.http.get<FxResponse>(url).subscribe({
      next: (data) => {
        if (data && data.rates) {
          this.rates.set(data.rates);
          this.isLoading.set(false);
          this.validationError.set('');
          if (this.chartInstance()) {
            this.updateChart();
          } else {
            this.chartShouldBeCreated = true;
          }
        } else {
          this.handleLoadError('Invalid format received from exchange API.');
        }
      },
      error: (err) => {
        console.error('Error loading rates:', err);
        this.handleLoadError('Failed to fetch real-time crypto prices. Check your connection.');
      }
    });
  }

  handleLoadError(msg: string) {
    this.isLoading.set(false);
    this.hasError.set(true);
    this.errorMessage.set(msg);
  }

  onModeChange(mode: 'buy' | 'sell') {
    this.calcMode.set(mode);
    // Reset defaults depending on mode
    if (mode === 'buy') {
      this.amount.set(1000);
    } else {
      this.amount.set(1);
    }
    this.validationError.set('');
    this.updateChart();
  }

  onAmountChange(event: Event) {
    const valStr = (event.target as HTMLInputElement).value;
    const val = valStr === '' ? null : parseFloat(valStr);

    if (val !== null && val <= 0) {
      this.validationError.set('Amount must be a positive number.');
    } else {
      this.validationError.set('');
    }
    this.amount.set(val);
    this.updateChart();
  }

  onFeeChange(event: Event) {
    const val = parseFloat((event.target as HTMLInputElement).value) || 0;
    this.feePercent.set(val);
    this.updateChart();
  }

  onCoinChange(newCoin: string) {
    this.selectedCoin.set(newCoin);
    this.updateChart();
  }

  onFiatChange(newFiat: string) {
    this.selectedFiat.set(newFiat);
    this.updateChart();
  }

  retryFetch() {
    this.fetchUsdRates();
  }

  private createChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    Chart.register(...registerables);

    if (!this.chartRef?.nativeElement) return;

    if (this.chartInstance()) {
      this.chartInstance()?.destroy();
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const calcs = this.calculations();
    if (!calcs) return;

    this.chartInstance.set(new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Net Value', 'Transaction Fee'],
        datasets: [{
          data: [calcs.net, calcs.fee],
          backgroundColor: ['#e11931', '#2a2a2a'],
          borderColor: '#151515',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'var(--pure-white-text)',
              font: { size: 12, family: 'Inter' }
            }
          },
          tooltip: {
            callbacks: {
              label: (item) => {
                const label = item.label || '';
                const val = item.raw as number;
                return ` ${label}: ${this.fiatSymbol()}${val.toFixed(2)}`;
              }
            }
          }
        }
      }
    }));
  }

  private updateChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    const chart = this.chartInstance();
    const calcs = this.calculations();
    if (!chart || !calcs) return;

    chart.data.datasets[0].data = [calcs.net, calcs.fee];
    chart.update();
  }
}
