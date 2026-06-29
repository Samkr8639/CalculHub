import { RouterLink } from '@angular/router';
import { Component, ChangeDetectionStrategy, OnInit, AfterViewChecked, inject, PLATFORM_ID, ViewChild, ElementRef, signal, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core';


interface FxResponse {
  base: string;
  timestamp: string;
  rates: { [key: string]: number };
}

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
  RouterLink, ]
})
export class CurrencyConverterComponent implements OnInit, AfterViewChecked {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('comparisonChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  amount = signal<number | null>(null);
  safeAmount = computed(() => this.amount() ?? 0);
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

  // Fix swapCurrencies
  swapCurrencies() {
    const temp = this.baseCurrency();
    this.baseCurrency.set(this.targetCurrency());
    this.targetCurrency.set(temp);
    this.searchBase.set('');
    this.searchTarget.set('');
    this.cdr.markForCheck(); // ← ADD THIS
    this.fetchRates(this.baseCurrency());
    this.chartShouldBeCreated = true;
  }

  // Add new method for autocomplete selection
  onBaseSelected(event: any) {
    const value = event.option.value;
    this.baseCurrency.set(value);
    this.searchBase.set('');
    this.fetchRates(value);
    this.cdr.markForCheck();
  }

  onTargetSelected(event: any) {
    const value = event.option.value;
    this.targetCurrency.set(value);
    this.searchTarget.set('');
    this.updateChart();
    this.cdr.markForCheck();
  }

  // Popular currencies for the quick summary list and chart
  popularCurrencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD', 'AED', 'CNY'];

  // Validation
  validationError = signal<string>('');

  // Calculations
  convertedAmount = computed(() => {
    const amt = this.safeAmount();
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
    console.log('CurrencyConverterComponent ngOnInit, baseCurrency=', this.baseCurrency());
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

    const baseLower = base.toLowerCase();
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseLower}.json`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        console.log('API response:', data);

        // Response: { date: "2026-05-22", usd: { inr: 84.5, eur: 0.92, ... } }
        const ratesRaw = data[baseLower];

        if (ratesRaw && typeof ratesRaw === 'object') {
          // Convert keys to uppercase to match your component's expectations
          const ratesMap: { [key: string]: number } = {};
          Object.keys(ratesRaw).forEach(key => {
            ratesMap[key.toUpperCase()] = ratesRaw[key];
          });

          this.rates.set(ratesMap);
          this.availableCurrencies.set(Object.keys(ratesMap).sort());
          this.isLoading.set(false);
          this.validationError.set('');
          this.cdr.markForCheck();
          if (this.chartInstance()) {
            this.updateChart();
          } else {
            this.chartShouldBeCreated = true;
          }
        } else {
          this.handleLoadError('Invalid response from API.');
        }
      },
      error: (err) => {
        console.error('API error:', err);
        this.handleLoadError(`Failed to fetch rates. Status: ${err.status}`);
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

  // Display function for mat-autocomplete
  displayFn(option: string): string {
    return option;
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

    const baseAmount = this.amount() ?? 100;
    const labels = this.popularCurrencies.filter(c => c !== this.baseCurrency());
    const data = labels.map(c => {
      const rate = this.rates()[c];
      return rate ? baseAmount * rate : 0;
    });

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `Value of ${baseAmount} ${this.baseCurrency()}`,
          data,
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
            labels: { color: '#ffffff', font: { size: 12, family: 'Inter' } }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${Number(context.raw).toFixed(2)} ${context.label}`
            }
          }
        },
        scales: {
          x: { ticks: { color: '#ffffff' }, grid: { color: '#2A2A2A' } },
          y: { ticks: { color: '#ffffff' }, grid: { color: '#2A2A2A' } }
        }
      }
    });

    this.chartInstance.set(chart);
  }

  private updateChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    const chart = this.chartInstance();
    if (!chart) return;

    const baseAmount = this.amount() ?? 100;
    const labels = this.popularCurrencies.filter(c => c !== this.baseCurrency());
    const data = labels.map(c => {
      const rate = this.rates()[c];
      return rate ? baseAmount * rate : 0;
    });

    chart.data.labels = labels;
    chart.data.datasets[0].label = `Value of ${baseAmount} ${this.baseCurrency()}`;
    chart.data.datasets[0].data = data;
    chart.update();
  }
}
