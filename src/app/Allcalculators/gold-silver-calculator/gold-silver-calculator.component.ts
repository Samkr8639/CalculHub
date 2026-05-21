import { ChangeDetectionStrategy, Component, OnInit, signal, computed, inject, ViewChild, ElementRef, AfterViewChecked, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';

interface GoldApiResponse {
  price: number;
  symbol: string;
  name: string;
}

interface FxResponse {
  rates: { [key: string]: number };
}

@Component({
  selector: 'app-gold-silver-calculator',
  templateUrl: './gold-silver-calculator.component.html',
  styleUrl: './gold-silver-calculator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class GoldSilverCalculatorComponent implements OnInit, AfterViewChecked {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('invoiceChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  public chartInstance = signal<Chart | null>(null);
  private chartShouldBeCreated = false;

  // Form Inputs
  selectedMetal = signal<'XAU' | 'XAG'>('XAU'); // XAU = Gold, XAG = Silver
  weight = signal<number | null>(10); // default 10 grams
  selectedUnit = signal<'grams' | 'tolas' | 'ounces' | 'kilograms'>('grams');
  selectedPurity = signal<number>(0.916); // default 22K (91.6%) for Gold, or Sterling (92.5%) for Silver
  selectedCurrency = signal<'INR' | 'USD'>('INR');
  makingChargePercent = signal<number>(10); // default 10% making charges
  gstPercent = signal<number>(3.0); // default 3.0% GST

  // Purity structures
  goldPurities = [
    { label: '24K (99.9% Fine)', value: 0.999 },
    { label: '22K (91.6% Jewel)', value: 0.916 },
    { label: '18K (75.0% Standard)', value: 0.750 },
    { label: '14K (58.3% Standard)', value: 0.583 },
    { label: '10K (41.7% Commercial)', value: 0.417 }
  ];

  silverPurities = [
    { label: 'Fine Silver (99.9%)', value: 0.999 },
    { label: 'Sterling Silver (92.5%)', value: 0.925 },
    { label: 'Coin Silver (90.0%)', value: 0.900 }
  ];

  // API States
  goldPriceUsd = signal<number>(0); // spot rate USD per Ounce
  silverPriceUsd = signal<number>(0);
  usdToInrRate = signal<number>(83.5); // USD/INR rate
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Validation
  validationError = signal<string>('');

  // Constants
  GRAMS_PER_TROY_OUNCE = 31.1034768;
  GRAMS_PER_TOLA = 11.6638;

  // Get active purity list based on metal
  activePurities = computed(() => {
    return this.selectedMetal() === 'XAU' ? this.goldPurities : this.silverPurities;
  });

  // Currency symbols
  currencySymbol = computed(() => {
    return this.selectedCurrency() === 'INR' ? '₹' : '$';
  });

  // Calculate live spot price in selected currency per troy ounce
  liveSpotPricePerOunce = computed(() => {
    const metal = this.selectedMetal();
    const currency = this.selectedCurrency();
    const usdPrice = metal === 'XAU' ? this.goldPriceUsd() : this.silverPriceUsd();
    const inrRate = this.usdToInrRate();

    if (currency === 'INR') {
      return usdPrice * inrRate;
    }
    return usdPrice;
  });

  // Spot price scaled to selected weight unit
  liveSpotPricePerUnit = computed(() => {
    const pricePerOunce = this.liveSpotPricePerOunce();
    const unit = this.selectedUnit();

    // 1 Ounce = 31.1035 grams
    // 1 Ounce = 31.1035 / 11.6638 tolas
    // 1 Ounce = 0.0311035 kilograms
    if (unit === 'ounces') return pricePerOunce;
    
    const pricePerGram = pricePerOunce / this.GRAMS_PER_TROY_OUNCE;
    if (unit === 'grams') return pricePerGram;
    if (unit === 'tolas') return pricePerGram * this.GRAMS_PER_TOLA;
    if (unit === 'kilograms') return pricePerGram * 1000;

    return 0;
  });

  // Invoice calculations
  invoice = computed(() => {
    const pricePerUnit = this.liveSpotPricePerUnit();
    const purity = this.selectedPurity();
    const wt = this.weight();
    const makingPercent = this.makingChargePercent();
    const taxPercent = this.gstPercent();

    if (wt === null || wt <= 0) return null;

    // 1. Metal Value = unit price * purity * weight
    const metalValue = pricePerUnit * purity * wt;

    // 2. Making Charges
    const makingCharges = metalValue * (makingPercent / 100);

    // 3. Taxable Value
    const taxableValue = metalValue + makingCharges;

    // 4. Tax/GST Value
    const gstValue = taxableValue * (taxPercent / 100);

    // 5. Total Bill
    const totalBill = taxableValue + gstValue;

    return {
      ratePerUnit: pricePerUnit * purity,
      metalValue,
      makingCharges,
      taxableValue,
      gstValue,
      totalBill
    };
  });

  ngOnInit() {
    this.fetchMarketData();
  }

  ngAfterViewChecked() {
    if (this.chartShouldBeCreated && this.chartRef?.nativeElement) {
      this.createChart();
      this.chartShouldBeCreated = false;
    }
  }

  fetchMarketData() {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');

    const goldUrl = 'https://api.gold-api.com/price/XAU';
    const silverUrl = 'https://api.gold-api.com/price/XAG';
    const fxUrl = 'https://fxapi.app/api/usd.json';

    forkJoin({
      gold: this.http.get<GoldApiResponse>(goldUrl),
      silver: this.http.get<GoldApiResponse>(silverUrl),
      fx: this.http.get<FxResponse>(fxUrl)
    }).subscribe({
      next: (res) => {
        if (res.gold && res.silver && res.fx && res.fx.rates) {
          this.goldPriceUsd.set(res.gold.price);
          this.silverPriceUsd.set(res.silver.price);
          this.usdToInrRate.set(res.fx.rates['INR'] || 83.5);
          this.isLoading.set(false);
          this.validationError.set('');

          // Set standard purity depending on selected metal on load
          if (this.selectedMetal() === 'XAU') {
            this.selectedPurity.set(0.916); // 22K standard
          } else {
            this.selectedPurity.set(0.925); // Sterling silver standard
          }

          if (this.chartInstance()) {
            this.updateChart();
          } else {
            this.chartShouldBeCreated = true;
          }
        } else {
          this.handleLoadError('Invalid response received from precious metals servers.');
        }
      },
      error: (err) => {
        console.error('ForkJoin fetching error:', err);
        this.handleLoadError('Failed to retrieve live precious metal rates. Please check connection.');
      }
    });
  }

  handleLoadError(msg: string) {
    this.isLoading.set(false);
    this.hasError.set(true);
    this.errorMessage.set(msg);
  }

  onMetalChange(metal: 'XAU' | 'XAG') {
    this.selectedMetal.set(metal);
    // Set default purity matching the metal
    if (metal === 'XAU') {
      this.selectedPurity.set(0.916);
    } else {
      this.selectedPurity.set(0.925);
    }
    this.updateChart();
  }

  onWeightChange(event: Event) {
    const valStr = (event.target as HTMLInputElement).value;
    const val = valStr === '' ? null : parseFloat(valStr);

    if (val !== null && val <= 0) {
      this.validationError.set('Weight must be a positive number.');
    } else {
      this.validationError.set('');
    }
    this.weight.set(val);
    this.updateChart();
  }

  onUnitChange(unit: 'grams' | 'tolas' | 'ounces' | 'kilograms') {
    this.selectedUnit.set(unit);
    this.updateChart();
  }

  onPurityChange(purity: number) {
    this.selectedPurity.set(purity);
    this.updateChart();
  }

  onCurrencyChange(curr: 'INR' | 'USD') {
    this.selectedCurrency.set(curr);
    // Adjust standard local tax (GST 3% for India, custom sales tax 0% default for US)
    if (curr === 'INR') {
      this.gstPercent.set(3.0);
    } else {
      this.gstPercent.set(0.0);
    }
    this.updateChart();
  }

  onMakingChargeChange(event: Event) {
    const val = parseFloat((event.target as HTMLInputElement).value) || 0;
    this.makingChargePercent.set(val);
    this.updateChart();
  }

  onTaxChange(event: Event) {
    const val = parseFloat((event.target as HTMLInputElement).value) || 0;
    this.gstPercent.set(val);
    this.updateChart();
  }

  retryFetch() {
    this.fetchMarketData();
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

    const invoiceData = this.invoice();
    if (!invoiceData) return;

    this.chartInstance.set(new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Metal Value', 'Making Charges', 'GST / Tax'],
        datasets: [{
          label: 'Invoice Components',
          data: [invoiceData.metalValue, invoiceData.makingCharges, invoiceData.gstValue],
          backgroundColor: ['#e11931', '#ffc107', '#28a745'],
          borderWidth: 0,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => `${item.label}: ${this.currencySymbol()}${Number(item.raw).toFixed(2)}`
            }
          }
        },
        scales: {
          x: { ticks: { color: 'var(--light-grey-text)' }, grid: { display: false } },
          y: { ticks: { color: 'var(--light-grey-text)' }, grid: { color: '#2A2A2A' } }
        }
      }
    }));
  }

  private updateChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    const chart = this.chartInstance();
    const invoiceData = this.invoice();
    if (!chart || !invoiceData) return;

    chart.data.datasets[0].data = [invoiceData.metalValue, invoiceData.makingCharges, invoiceData.gstValue];
    chart.update();
  }
}
