import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  AfterViewChecked,
  OnDestroy,
  signal,
  computed,
  inject,
  ViewChild,
  ElementRef,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import {
  Chart,
  registerables
} from 'chart.js';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

Chart.register(...registerables);

interface FxResponse {
  base: string;
  timestamp: string;
  rates: { [key: string]: number };
}

interface CryptoInfo {
  symbol: string;
  name: string;
}

interface FiatInfo {
  symbol: string;
  name: string;
  prefix: string;
}

@Component({
  selector: 'app-crypto-calculator',
  standalone: true,
  templateUrl: './crypto-calculator.component.html',
  styleUrls: ['./crypto-calculator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule
  ]
})
export class CryptoCalculatorComponent
  implements OnInit, AfterViewChecked, OnDestroy {

  private http = inject(HttpClient);

  private platformId = inject(PLATFORM_ID);

  @ViewChild('feeChart')
  private chartRef!: ElementRef<HTMLCanvasElement>;

  chartInstance = signal<Chart | null>(null);

  private chartShouldBeCreated = false;

  // ------------------------
  // Fiat currencies
  // ------------------------

  readonly supportedFiats: FiatInfo[] = [
    { symbol: 'INR', name: 'Indian Rupee', prefix: '₹' },
    { symbol: 'USD', name: 'US Dollar', prefix: '$' },
    { symbol: 'EUR', name: 'Euro', prefix: '€' },
    { symbol: 'GBP', name: 'British Pound', prefix: '£' },
    { symbol: 'AED', name: 'UAE Dirham', prefix: 'د.إ' },
    { symbol: 'JPY', name: 'Japanese Yen', prefix: '¥' },
    { symbol: 'AUD', name: 'Australian Dollar', prefix: 'A$' },
    { symbol: 'CAD', name: 'Canadian Dollar', prefix: 'C$' },
    { symbol: 'SGD', name: 'Singapore Dollar', prefix: 'S$' },
    { symbol: 'CHF', name: 'Swiss Franc', prefix: 'Fr' }
  ];

  readonly fiatCurrencies = new Set(
    this.supportedFiats.map(f => f.symbol)
  );

  // ------------------------
  // Coin names
  // ------------------------

  readonly cryptoNames: { [key: string]: string } = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    SOL: 'Solana',
    XRP: 'Ripple',
    ADA: 'Cardano',
    DOGE: 'Dogecoin',
    LTC: 'Litecoin',
    BNB: 'Binance Coin',
    AVAX: 'Avalanche',
    LINK: 'Chainlink',
    TRX: 'TRON'
  };

  // ------------------------
  // Signals
  // ------------------------

  calcMode = signal<'buy' | 'sell'>('buy');

  amount = signal<number | null>(1000);

  selectedCoin = signal<string>('BTC');

  selectedFiat = signal<string>('INR');

  feePercent = signal<number>(1);

  rates = signal<{ [key: string]: number }>({});

  supportedCoins = signal<CryptoInfo[]>([]);

  isLoading = signal<boolean>(false);

  hasError = signal<boolean>(false);

  errorMessage = signal<string>('');

  validationError = signal<string>('');

  searchCoin = signal<string>('');

  searchFiat = signal<string>('');

  // ------------------------
  // Computed
  // ------------------------

  filteredCoins = computed(() => {

    const term = this.searchCoin().toLowerCase();

    const coins = this.supportedCoins();

    if (!term) return coins;

    return coins.filter(c =>
      c.symbol.toLowerCase().includes(term) ||
      c.name.toLowerCase().includes(term)
    );
  });

  filteredFiats = computed(() => {

    const term = this.searchFiat().toLowerCase();

    if (!term) return this.supportedFiats;

    return this.supportedFiats.filter(f =>
      f.symbol.toLowerCase().includes(term) ||
      f.name.toLowerCase().includes(term)
    );
  });

  fiatSymbol = computed(() => {

    const found = this.supportedFiats.find(
      f => f.symbol === this.selectedFiat()
    );

    return found ? found.prefix : '';
  });

  // ------------------------
  // Coin price calculation
  // ------------------------

  coinPriceInFiat = computed(() => {

    const coin = this.selectedCoin();

    const fiat = this.selectedFiat();

    const rates = this.rates();

    if (!rates[coin] || !rates[fiat]) {
      return null;
    }

    const usdPerCoin = 1 / rates[coin];

    const fiatPerUsd = rates[fiat];

    return usdPerCoin * fiatPerUsd;

  });

  calculations = computed(() => {

    const amt = this.amount();

    const price = this.coinPriceInFiat();

    const feeRate = this.feePercent() / 100;

    if (!amt || !price) {
      return null;
    }

    // BUY
    if (this.calcMode() === 'buy') {

      const fee = amt * feeRate;

      const net = amt - fee;

      const crypto = net / price;

      return {
        gross: amt,
        fee,
        net,
        result: crypto,
        resultLabel: 'Crypto Received',
        resultUnit: this.selectedCoin()
      };
    }

    // SELL
    const gross = amt * price;

    const fee = gross * feeRate;

    const net = gross - fee;

    return {
      gross,
      fee,
      net,
      result: net,
      resultLabel: 'Net Payout',
      resultUnit: this.selectedFiat()
    };
  });

  // ------------------------
  // Lifecycle
  // ------------------------

  ngOnInit() {
    this.fetchUsdRates();
  }

  ngAfterViewChecked() {

    if (
      this.chartShouldBeCreated &&
      this.chartRef?.nativeElement
    ) {

      this.createChart();

      this.chartShouldBeCreated = false;
    }
  }

  ngOnDestroy() {
    this.chartInstance()?.destroy();
  }

  // ------------------------
  // API
  // ------------------------

  fetchUsdRates() {

    this.isLoading.set(true);

    this.hasError.set(false);

    this.errorMessage.set('');

    const url = `https://fxapi.app/api/usd.json?_=${Date.now()}`;

    this.http.get<FxResponse>(url).subscribe({

      next: (data) => {

        if (data && data.rates) {

          this.rates.set(data.rates);

          this.isLoading.set(false);

          this.validationError.set('');

          const allCoins = Object.keys(data.rates)

            .filter(symbol => {

              return (
                !this.fiatCurrencies.has(symbol) &&
                symbol.length >= 2 &&
                symbol.length <= 10
              );
            })

            .map(symbol => ({
              symbol,
              name: this.cryptoNames[symbol] || symbol
            }))

            .sort((a, b) =>
              a.symbol.localeCompare(b.symbol)
            );

          this.supportedCoins.set(allCoins);

          Promise.resolve().then(() => {

            if (this.chartInstance()) {

              this.updateChart();

            } else {

              this.chartShouldBeCreated = true;
            }
          });

        } else {

          this.handleLoadError(
            'Invalid API response.'
          );
        }
      },

      error: (err) => {

        console.error(err);

        this.handleLoadError(
          'Failed to fetch rates.'
        );
      }
    });
  }

  handleLoadError(msg: string) {

    this.isLoading.set(false);

    this.hasError.set(true);

    this.errorMessage.set(msg);
  }

  retryFetch() {
    this.fetchUsdRates();
  }

  // ------------------------
  // Events
  // ------------------------

  onModeChange(mode: 'buy' | 'sell') {

    this.calcMode.set(mode);

    this.amount.set(
      mode === 'buy' ? 1000 : 1
    );

    this.updateChart();
  }

  onAmountChange(event: Event) {

    const val = parseFloat(
      (event.target as HTMLInputElement).value
    );

    if (val <= 0) {

      this.validationError.set(
        'Amount must be positive.'
      );

      return;
    }

    this.validationError.set('');

    this.amount.set(val);

    this.updateChart();
  }

  onFeeChange(event: Event) {

    const val = parseFloat(
      (event.target as HTMLInputElement).value
    );

    this.feePercent.set(val);

    this.updateChart();
  }

  onCoinSelected(event: any) {

    const coin = event.option.value as CryptoInfo;

    if (!coin) return;

    this.selectedCoin.set(coin.symbol);

    this.searchCoin.set('');

    this.updateChart();
  }

  onFiatSelected(event: any) {

    const fiat = event.option.value as FiatInfo;

    if (!fiat) return;

    this.selectedFiat.set(fiat.symbol);

    this.searchFiat.set('');

    this.updateChart();
  }

  // ------------------------
  // Display Functions
  // ------------------------

  displayCoin = (
    coin?: CryptoInfo | string | null
  ): string => {

    if (!coin) return '';

    if (typeof coin === 'string') {

      const found = this.supportedCoins()
        .find(c => c.symbol === coin);

      return found
        ? `${found.name} (${found.symbol})`
        : coin;
    }

    return `${coin.name} (${coin.symbol})`;
  };

  displayFiat = (
    fiat?: FiatInfo | string | null
  ): string => {

    if (!fiat) return '';

    if (typeof fiat === 'string') {

      const found = this.supportedFiats
        .find(f => f.symbol === fiat);

      return found
        ? `${found.name} (${found.symbol})`
        : fiat;
    }

    return `${fiat.name} (${fiat.symbol})`;
  };

  // ------------------------
  // Chart
  // ------------------------

  private createChart() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.chartRef?.nativeElement) {
      return;
    }

    const calcs = this.calculations();

    if (!calcs) {
      return;
    }

    const ctx =
      this.chartRef.nativeElement.getContext('2d');

    if (!ctx) {
      return;
    }

    this.chartInstance()?.destroy();

    this.chartInstance.set(

      new Chart(ctx, {

        type: 'bar',

        data: {

          labels: [
            'Net Value',
            'Transaction Fee'
          ],

          datasets: [{
            data: [
              calcs.net,
              calcs.fee
            ],
            borderRadius: 8,
            backgroundColor: [
              '#e11931',
              '#2f2f2f'
            ]
          }]
        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: false
            },

            tooltip: {

              callbacks: {

                label: (item) => {

                  const value =
                    item.raw as number;

                  return `${this.fiatSymbol()}${value.toFixed(2)}`;
                }
              }
            }
          },

          scales: {

            x: {

              ticks: {
                color: '#ffffff'
              },

              grid: {
                display: false
              }
            },

            y: {

              ticks: {
                color: '#ffffff'
              },

              grid: {
                color: '#2a2a2a'
              }
            }
          }
        }
      })
    );
  }

  private updateChart() {

    const chart = this.chartInstance();

    const calcs = this.calculations();

    if (!chart || !calcs) {
      return;
    }

    chart.data.datasets[0].data = [
      calcs.net,
      calcs.fee
    ];

    chart.update();
  }
}