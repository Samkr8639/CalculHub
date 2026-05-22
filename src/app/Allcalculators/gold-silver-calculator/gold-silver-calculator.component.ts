import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  computed,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';


import {
  Chart,
  registerables
} from 'chart.js';

import { forkJoin, startWith, map } from 'rxjs';

/* Angular Material */
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

interface GoldApiResponse {
  price: number;
  symbol: string;
  name: string;
}

interface FxResponse {
  rates: { [key: string]: number };
}

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
}

@Component({
  selector: 'app-gold-silver-calculator',
  standalone: true,
  templateUrl: './gold-silver-calculator.component.html',
  styleUrl: './gold-silver-calculator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class GoldSilverCalculatorComponent
  implements OnInit, AfterViewInit {

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('invoiceChart')
  chartRef!: ElementRef<HTMLCanvasElement>;

  chartInstance: Chart | null = null;

  /* =========================================
      CURRENCIES
  ========================================= */

currencies: CurrencyInfo[] = [

  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' }
];

currencyControl = new FormControl('');

filteredCurrencies = signal<CurrencyInfo[]>(this.currencies);

  selectedCurrency = signal<string>('INR');

  /* =========================================
      FORM SIGNALS
  ========================================= */

  selectedMetal = signal<'XAU' | 'XAG'>('XAU');

  weight = signal<number | null>(10);

  selectedUnit = signal<
    'grams' | 'tolas' | 'ounces' | 'kilograms'
  >('grams');

  selectedPurity = signal<number>(0.916);

  makingChargePercent = signal<number>(10);

  gstPercent = signal<number>(3);

  validationError = signal<string>('');

  /* =========================================
      API DATA
  ========================================= */

  goldPriceUsd = signal<number>(0);

  silverPriceUsd = signal<number>(0);

  forexRates = signal<{ [key: string]: number }>({});

  isLoading = signal<boolean>(false);

  hasError = signal<boolean>(false);

  errorMessage = signal<string>('');

  /* =========================================
      CONSTANTS
  ========================================= */

  readonly GRAMS_PER_TROY_OUNCE = 31.1034768;

  readonly GRAMS_PER_TOLA = 11.6638;

  /* =========================================
      PURITY
  ========================================= */

  goldPurities = [
    { label: '24K (99.9%)', value: 0.999 },
    { label: '22K (91.6%)', value: 0.916 },
    { label: '18K (75%)', value: 0.75 },
    { label: '14K (58.3%)', value: 0.583 },
    { label: '10K (41.7%)', value: 0.417 }
  ];

  silverPurities = [
    { label: 'Fine Silver (99.9%)', value: 0.999 },
    { label: 'Sterling Silver (92.5%)', value: 0.925 },
    { label: 'Coin Silver (90%)', value: 0.9 }
  ];

  activePurities = computed(() => {
    return this.selectedMetal() === 'XAU'
      ? this.goldPurities
      : this.silverPurities;
  });

  /* =========================================
      CURRENCY SYMBOL
  ========================================= */

  currencySymbol = computed(() => {
    const currency = this.currencies.find(
      x => x.code === this.selectedCurrency()
    );

    return currency?.symbol || '₹';
  });

  /* =========================================
      LIVE SPOT PRICE
  ========================================= */

  liveSpotPricePerOunce = computed(() => {

    const metalPrice =
      this.selectedMetal() === 'XAU'
        ? this.goldPriceUsd()
        : this.silverPriceUsd();

    const currency = this.selectedCurrency();

    if (currency === 'USD') {
      return metalPrice;
    }

    const rates = this.forexRates();

    const conversionRate = rates[currency] || 1;

    return metalPrice * conversionRate;
  });

  liveSpotPricePerUnit = computed(() => {

    const ouncePrice = this.liveSpotPricePerOunce();

    switch (this.selectedUnit()) {

      case 'grams':
        return ouncePrice / this.GRAMS_PER_TROY_OUNCE;

      case 'tolas':
        return (
          ouncePrice /
          this.GRAMS_PER_TROY_OUNCE *
          this.GRAMS_PER_TOLA
        );

      case 'kilograms':
        return (
          ouncePrice /
          this.GRAMS_PER_TROY_OUNCE *
          1000
        );

      case 'ounces':
        return ouncePrice;

      default:
        return ouncePrice;
    }
  });

  /* =========================================
      INVOICE CALCULATION
  ========================================= */

  invoice = computed(() => {

    const wt = this.weight();

    if (wt === null || wt <= 0) {
      return null;
    }

    const purity = this.selectedPurity();

    const pricePerUnit =
      this.liveSpotPricePerUnit();

    const metalValue =
      pricePerUnit * purity * wt;

    const makingCharges =
      metalValue *
      (this.makingChargePercent() / 100);

    const taxableValue =
      metalValue + makingCharges;

    const gstValue =
      taxableValue *
      (this.gstPercent() / 100);

    const totalBill =
      taxableValue + gstValue;

    return {
      ratePerUnit: pricePerUnit * purity,
      metalValue,
      makingCharges,
      taxableValue,
      gstValue,
      totalBill
    };
  });

  /* =========================================
      INIT
  ========================================= */

  ngOnInit(): void {

    this.setupCurrencyAutocomplete();

    this.fetchMarketData();
  }

  ngAfterViewInit(): void {

  // VERY IMPORTANT
  // Prevent chart from rendering during SSR

  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  Chart.register(...registerables);

  setTimeout(() => {
    this.createChart();
  }, 300);
}

  /* =========================================
      AUTOCOMPLETE
  ========================================= */

setupCurrencyAutocomplete(): void {

  this.currencyControl.valueChanges
    .pipe(
      startWith(''),
      map(value => {

        const search =
          typeof value === 'string'
            ? value.toLowerCase()
            : '';

        return this.currencies.filter(currency =>
          currency.name.toLowerCase().includes(search) ||
          currency.code.toLowerCase().includes(search)
        );
      })
    )
    .subscribe(result => {
      this.filteredCurrencies.set(result);
    });
}

displayCurrency(currency: CurrencyInfo): string {

  if (!currency) {
    return '';
  }

  return `${currency.name} (${currency.code})`;
}

  /* =========================================
      API FETCH
  ========================================= */

  fetchMarketData(): void {

    this.isLoading.set(true);

    this.hasError.set(false);

    const goldUrl =
      'https://api.gold-api.com/price/XAU';

    const silverUrl =
      'https://api.gold-api.com/price/XAG';

    const forexUrl =
      'https://open.er-api.com/v6/latest/USD';

    forkJoin({
      gold: this.http.get<GoldApiResponse>(goldUrl),
      silver: this.http.get<GoldApiResponse>(silverUrl),
      forex: this.http.get<any>(forexUrl)
    }).subscribe({

      next: (response) => {

        this.goldPriceUsd.set(response.gold.price);

        this.silverPriceUsd.set(response.silver.price);

        this.forexRates.set(response.forex.rates || {});

        this.isLoading.set(false);
      },

      error: (error) => {

        console.error(error);

        this.isLoading.set(false);

        this.hasError.set(true);

        this.errorMessage.set(
          'Failed to fetch live precious metal rates.'
        );
      }
    });
  }

  retryFetch(): void {
    this.fetchMarketData();
  }

  /* =========================================
      EVENTS
  ========================================= */

  onMetalChange(metal: 'XAU' | 'XAG'): void {

    this.selectedMetal.set(metal);

    if (metal === 'XAU') {
      this.selectedPurity.set(0.916);
    } else {
      this.selectedPurity.set(0.925);
    }

    this.updateChart();
  }

  onWeightChange(event: Event): void {

    const value =
      parseFloat(
        (event.target as HTMLInputElement).value
      );

    if (isNaN(value) || value <= 0) {

      this.validationError.set(
        'Please enter valid weight.'
      );

      this.weight.set(null);

    } else {

      this.validationError.set('');

      this.weight.set(value);
    }

    this.updateChart();
  }

  onUnitChange(
    unit: 'grams' | 'tolas' | 'ounces' | 'kilograms'
  ): void {

    this.selectedUnit.set(unit);

    this.updateChart();
  }

  onPurityChange(purity: number): void {

    this.selectedPurity.set(Number(purity));

    this.updateChart();
  }

  onCurrencyChange(currency: CurrencyInfo): void {

    if (!currency) return;

    this.selectedCurrency.set(currency.code);

    if (currency.code === 'INR') {
      this.gstPercent.set(3);
    }

    this.currencyControl.setValue(
      `${currency.name} (${currency.code})`
    );

    this.updateChart();
  }

  onMakingChargeChange(event: Event): void {

    const value =
      parseFloat(
        (event.target as HTMLInputElement).value
      ) || 0;

    this.makingChargePercent.set(value);

    this.updateChart();
  }

  onTaxChange(event: Event): void {

    const value =
      parseFloat(
        (event.target as HTMLInputElement).value
      ) || 0;

    this.gstPercent.set(value);

    this.updateChart();
  }

  /* =========================================
      CHART
  ========================================= */

private createChart(): void {

  // Prevent SSR crash
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  // Canvas not available yet
  if (!this.chartRef?.nativeElement) {
    return;
  }

  const invoiceData = this.invoice();

  if (!invoiceData) {
    return;
  }

  const canvas = this.chartRef.nativeElement;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  // Destroy previous chart
  if (this.chartInstance) {
    this.chartInstance.destroy();
  }

  this.chartInstance = new Chart(ctx, {

    type: 'doughnut',

    data: {

      labels: [
        'Metal Value',
        'Making Charges',
        'GST / Tax'
      ],

      datasets: [
        {
          data: [
            invoiceData.metalValue,
            invoiceData.makingCharges,
            invoiceData.gstValue
          ],

          backgroundColor: [
            '#ff1744',
            '#ff9100',
            '#00c853'
          ],

          borderWidth: 0
        }
      ]
    },

    options: {

      responsive: true,

      maintainAspectRatio: false,

      plugins: {

        legend: {
          position: 'bottom',

          labels: {
            color: '#ffffff'
          }
        }
      }
    }
  });
}

 private updateChart(): void {

  // SSR protection
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  const invoiceData = this.invoice();

  if (!invoiceData) {
    return;
  }

  // If chart not created yet
  if (!this.chartInstance) {

    setTimeout(() => {
      this.createChart();
    }, 100);

    return;
  }

  this.chartInstance.data.datasets[0].data = [
    invoiceData.metalValue,
    invoiceData.makingCharges,
    invoiceData.gstValue
  ];

  this.chartInstance.update();
}

  exchangeRate = computed(() => {

  const currency = this.selectedCurrency();

  if (currency === 'USD') {
    return 1;
  }

  const rates = this.forexRates();

  return rates[currency] || 1;
});
}