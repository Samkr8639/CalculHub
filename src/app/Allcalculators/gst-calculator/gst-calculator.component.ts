import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, signal, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { EmbedWidgetComponent } from '../../embed-widget/embed-widget.component';
import { ShareWidgetComponent } from '../../share-widget/share-widget.component';

@Component({
  selector: 'app-gst-calculator',
  templateUrl: './gst-calculator.component.html',
  styleUrl: './gst-calculator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, EmbedWidgetComponent, ShareWidgetComponent, RouterLink]
})
export class GstCalculatorComponent implements AfterViewInit, AfterViewChecked {
  private platformId = inject(PLATFORM_ID);

  @ViewChild('gstPieChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  public chartInstance = signal<Chart<'pie', number[], string> | null>(null);

  amount = signal<number | null>(null);
  gstRate = signal<number | null>(null);
  calculationMode = signal<'include' | 'exclude'>('exclude');

  calculatedGstAmount = signal<number | null>(null);
  calculatedNetPrice = signal<number | null>(null);
  calculatedBasePrice = signal<number | null>(null);

  private chartShouldBeCreated = false;

  constructor() {
  }

  ngAfterViewInit(): void {
    // Initial setup after view is initialized
  }

  ngAfterViewChecked(): void {
    // This hook runs after the view has been updated.
    // We check if a chart needs to be created and if the canvas is now available.
    if (this.chartShouldBeCreated && this.chartRef?.nativeElement) {
      this.createChart();
      this.chartShouldBeCreated = false; // Reset the flag
    }
  }

  onAmountChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.amount.set(parseFloat(value) || null);
    this.calculateGst();
  }

  onGstRateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.gstRate.set(parseFloat(value) || null);
    this.calculateGst();
  }

  calculateGst() {
    const currentAmount = this.amount();
    const currentRate = this.gstRate();

    if (currentAmount !== null && currentRate !== null && currentAmount >= 0 && currentRate >= 0) {
      let gstAmount: number;
      let netPrice: number | null = null;
      let basePrice: number | null = null;

      if (this.calculationMode() === 'exclude') {
        gstAmount = (currentAmount * currentRate) / 100;
        netPrice = currentAmount + gstAmount;
        basePrice = currentAmount;
      } else {
        gstAmount = currentAmount * (currentRate / (100 + currentRate));
        basePrice = currentAmount - gstAmount;
        netPrice = currentAmount;
      }

      this.calculatedGstAmount.set(gstAmount);
      this.calculatedNetPrice.set(netPrice);
      this.calculatedBasePrice.set(basePrice);

      // If a chart instance already exists, just update it.
      if (this.chartInstance()) {
        this.updateChart();
      } else {
        // If not, set a flag indicating that a chart should be created.
        // ngAfterViewChecked will pick this up once the canvas is rendered.
        this.chartShouldBeCreated = true;
      }
    } else {
      this.clearCalculations();
    }
  }

  clearCalculations() {
    this.calculatedGstAmount.set(null);
    this.calculatedNetPrice.set(null);
    this.calculatedBasePrice.set(null);
    if (this.chartInstance()) {
      this.chartInstance()?.destroy();
      this.chartInstance.set(null);
    }
    this.chartShouldBeCreated = false;
  }

  resetCalculations() {
    this.amount.set(null);
    this.gstRate.set(null);
    this.clearCalculations();
  }

  private createChart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    Chart.register(...registerables);
    if (!this.chartRef || !this.chartRef.nativeElement) return;
    
    const baseValue = this.calculationMode() === 'exclude' ? this.amount() : this.calculatedBasePrice();
    const gstAmount = this.calculatedGstAmount();

    if (baseValue === null || gstAmount === null) return;
    
    if (this.chartInstance()) {
      this.chartInstance()?.destroy();
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.chartInstance.set(new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Base Amount', 'GST Amount'],
          datasets: [{
            data: [baseValue, gstAmount],
            backgroundColor: ['#e11931', '#4A4A4A'],
            hoverBackgroundColor: ['#c41026', '#5A5A5A'],
            borderColor: '#333',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: 'var(--pure-white-text)', font: { size: 14 } } },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const label = tooltipItem.label || '';
                  const value = tooltipItem.raw as number;
                  return `${label}: ${value.toFixed(2)}`;
                }
              }
            }
          }
        }
      }));
    }
  }

  private updateChart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.chartInstance() && this.calculatedGstAmount() !== null && this.calculatedBasePrice() !== null) {
      const baseValue = this.calculationMode() === 'exclude' ? this.amount() : this.calculatedBasePrice();
      const gstAmount = this.calculatedGstAmount();

      if (baseValue === null || gstAmount === null) return;

      this.chartInstance()!.data.datasets[0].data = [baseValue, gstAmount];
      this.chartInstance()!.update();
    }
  }

  get shareResultText(): string {
    const amount = this.amount();
    const rate = this.gstRate();
    const gstAmount = this.calculatedGstAmount();
    const netPrice = this.calculatedNetPrice();
    const mode = this.calculationMode();
    if (amount === null || rate === null || gstAmount === null || netPrice === null) return '';
    if (mode === 'exclude') {
      return `Calculated GST for ₹${amount.toLocaleString('en-IN')} at ${rate}% is ₹${Math.round(gstAmount).toLocaleString('en-IN')} (Total: ₹${Math.round(netPrice).toLocaleString('en-IN')}) on CalculHub!`;
    } else {
      return `Extracted GST from ₹${amount.toLocaleString('en-IN')} at ${rate}% is ₹${Math.round(gstAmount).toLocaleString('en-IN')} (Base: ₹${Math.round(amount - gstAmount).toLocaleString('en-IN')}) on CalculHub!`;
    }
  }
}
