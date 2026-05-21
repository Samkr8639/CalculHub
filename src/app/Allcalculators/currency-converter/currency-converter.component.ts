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

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class CurrencyConverterComponent implements OnInit, AfterViewChecked {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('comparisonChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  amount = signal<number | null>(null);
  baseCurrency = signal<string>('USD');
  targetCurrency = signal<string>('INR');
  rates = signal<{ [key: string]: number }>({});
  availableCurrencies = signal<string[]>([]);
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  public chartInstance = signal<Chart | null>(null);
  private chartShouldBeCreated = false;

  // Search terms for dropdowns
  searchBase = signal<string>('');
  searchTarget = signal<string>('');

  // Filtered currency lists based on search term
  filteredBaseCurrencies = computed(() => {
    const term = this.searchBase().toLowerCase();
    return this.availableCurrencies().filter(c => c.toLowerCase().includes(term));
  });

  filteredTargetCurrencies = computed(() => {
    const term = this.searchTarget().toLowerCase();
    return this.availableCurrencies().filter(c => c.toLowerCase().includes(term));
  });

  // Helper to get flag URL (using country code mapping for demonstration)
  flagUrl(currency: string): string {
    const map: { [key: string]: string } = {
      USD: 'us', EUR: 'eu', INR: 'in', GBP: 'gb', JPY: 'jp', AUD: 'au', CAD: 'ca', SGD: 'sg', AED: 'ae', CNY: 'cn'
    };
    const country = map[currency] || 'un';
    return `https://flagcdn.com/24x18/${country}.png`;
  }

  // Update search term signals
  onBaseSearch(event: Event) {
    this.searchBase.set((event.target as HTMLInputElement).value);
  }

  onTargetSearch(event: Event) {
    this.searchTarget.set((event.target as HTMLInputElement).value);
  }

  // Ensure chart recreation after swap
  swapCurrencies() {
    const temp = this.baseCurrency();
    this.baseCurrency.set(this.targetCurrency());
    this.targetCurrency.set(temp);
    this.searchBase.set('');
    this.searchTarget.set('');
    this.fetchRates(this.baseCurrency());
    this.chartShouldBeCreated = true;
  }

  // Popular currencies for the quick summary list and chart
  popularCurrencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD', 'AED', 'CNY'];

  // Validation
  validationError = signal<string>('');

  // Calculations
  convertedAmount = computed(() => {
    const amt = this.amount();
    const target = this.targetCurrency();
    const rateList = this.rates();

    if (amt === null || amt <= 0) return null;
    if (!rateList || !rateList[target]) return null;

    return amt * rateList[target];
  });

  inverseRate = computed(() => {
    const target = this.targetCurrency();
    const rateList = this.rates();

    if (!rateList || !rateList[target]) return null;
    return 1 / rateList[target];
  });

  ngOnInit() {
    this.fetchRates(this.baseCurrency());
  }

  ngAfterViewChecked() {
    if (this.chartShouldBeCreated && this.chartRef?.nativeElement) {
      this.createChart();
      this.chartShouldBeCreated = false;
    }
  }

  fetchRates(base: string) {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');

    const url = `https://fxapi.app/api/${base.toLowerCase()}.json`;

    this.http.get<FxResponse>(url).subscribe({
      next: (data) => {
        if (data && data.rates) {
          this.rates.set(data.rates);
          // Set list of available currencies if not set
          if (this.availableCurrencies().length === 0) {
            const sortedCurrencies = Object.keys(data.rates).sort();
            this.availableCurrencies.set(sortedCurrencies);
          }
          this.isLoading.set(false);
          this.validationError.set('');

          // Trigger chart update or recreation
          if (this.chartInstance()) {
            this.updateChart();
          } else {
            this.chartShouldBeCreated = true;
          }
        } else {
          this.handleLoadError('Invalid response format received from currency API.');
        }
      },
      error: (err) => {
        console.error('Error fetching currency rates:', err);
        this.handleLoadError('Failed to fetch real-time exchange rates. Please check your internet connection and try again.');
      }
    });
  }

  handleLoadError(msg: string) {
    this.isLoading.set(false);
    this.hasError.set(true);
    this.errorMessage.set(msg);
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

  onBaseChange(newBase: string) {
    this.baseCurrency.set(newBase);
    this.fetchRates(newBase);
  }

  onTargetChange(newTarget: string) {
    this.targetCurrency.set(newTarget);
    this.updateChart();
  }


  retryFetch() {
    this.fetchRates(this.baseCurrency());
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

    // Data points: conversions of 100 base currency to popular currencies
    const chartLabels = this.popularCurrencies.filter(c => c !== this.baseCurrency());
    const chartData = chartLabels.map(c => {
      const rate = this.rates()[c];
      return rate ? 100 * rate : 0;
    });

    this.chartInstance.set(new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: `Value of 100 ${this.baseCurrency()}`,
          data: chartData,
          backgroundColor: '#e11931',
          borderColor: '#e11931',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'var(--pure-white-text)',
              font: { size: 12, family: 'Inter' }
            }
          },
          tooltip: {
            callbacks: {
              label: (item) => `${item.dataset.label}: ${Number(item.raw).toFixed(2)} ${item.label}`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: 'var(--pure-white-text)' },
            grid: { color: '#2A2A2A' }
          },
          y: {
            ticks: { color: 'var(--pure-white-text)' },
            grid: { color: '#2A2A2A' }
          }
        }
      }
    }));
  }

  private updateChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    const chart = this.chartInstance();
    if (!chart) return;

    const chartLabels = this.popularCurrencies.filter(c => c !== this.baseCurrency());
    const chartData = chartLabels.map(c => {
      const rate = this.rates()[c];
      return rate ? 100 * rate : 0;
    });

    chart.data.labels = chartLabels;
    chart.data.datasets[0].label = `Value of 100 ${this.baseCurrency()}`;
    chart.data.datasets[0].data = chartData;
    chart.update();
  }
}
