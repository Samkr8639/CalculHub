import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';



@Component({
  selector: 'app-tax-calculator',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './tax-calculator.html',
  styleUrls: ['./tax-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxCalculatorComponent {
  private platformId = inject(PLATFORM_ID);

  grossIncome = signal<number | null>(60000);
  deductions = signal<number | null>(2000);

  taxableIncome = signal<number | null>(null);
  totalTax = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('taxChart');

  constructor() {
    effect(() => {
      const canvas = this.chartCanvas();
      if (canvas && this.taxableIncome() !== null) {
        if (this.chartInstance()) {
          this.updateChart();
        } else {
          this.createChart();
        }
      } else if (this.chartInstance()) {
        this.clearChart();
      }
    });
    this.calculateTax();
  }

  onIncomeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.grossIncome.set(parseFloat(value) || null);
    this.calculateTax();
  }

  onDeductionsChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.deductions.set(parseFloat(value) || null);
    this.calculateTax();
  }

  calculateTax() {
    const income = this.grossIncome();
    const deduct = this.deductions();

    if (income !== null && deduct !== null && income >= 0 && deduct >= 0) {
      const taxable = Math.max(0, income - deduct);
      this.taxableIncome.set(taxable);

      const taxBrackets = [
        { limit: 300000, rate: 0.00 },
        { limit: 700000, rate: 0.05 },
        { limit: 1000000, rate: 0.10 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
      ];

      let tax = 0;
      let remainingIncome = taxable;
      let previousLimit = 0;

      for (const bracket of taxBrackets) {
        if (remainingIncome > 0) {
          const limitRange = bracket.limit - previousLimit;
          const taxableInBracket = Math.min(remainingIncome, limitRange);
          tax += taxableInBracket * bracket.rate;
          remainingIncome -= taxableInBracket;
          previousLimit = bracket.limit;
        } else {
          break;
        }
      }

      // Section 87A rebate for new regime (no tax if income <= 7,00,000)
      if (taxable <= 700000) {
        tax = 0;
      }

      this.totalTax.set(tax);
    } else {
      this.clearCalculations();
    }
  }

  private generateChartData() {
    const income = this.grossIncome() ?? 0;
    const deductions = this.deductions() ?? 0;
    const tax = this.totalTax() ?? 0;
    const netIncome = income - deductions - tax;

    return {
      labels: ['Gross Income', 'Deductions', 'Tax', 'Net Income'],
      data: [income, deductions, tax, netIncome],
    };
  }

  private createChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    Chart.register(...registerables);

    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;

    const { labels, data } = this.generateChartData();

    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: 'Amount',
          data,
          backgroundColor: [
            '#4299e1', // Gross Income
            '#f56565', // Deductions
            '#ed8936', // Tax
            '#68d391', // Net Income
          ],
          borderWidth: 1,
        },
      ],
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { 
            color: '#ccc',
            callback: (value) => `₹${Number(value) / 1000}k`
          },
        },
        y: {
          grid: { display: false },
          ticks: { color: '#ccc' },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.raw as number;
              return `${label}: ₹${value.toFixed(2)}`;
            },
          },
        },
      },
    };

    this.chartInstance.set(new Chart(canvas, { type: 'bar', data: chartData, options }));
  }

  private updateChart() {
    if (!isPlatformBrowser(this.platformId)) return;

    const chart = this.chartInstance();
    if (chart) {
      const { data } = this.generateChartData();
      chart.data.datasets[0].data = data;
      chart.update();
    }
  }

  private clearCalculations() {
    this.taxableIncome.set(null);
    this.totalTax.set(null);
  }

  private clearChart() {
    const chart = this.chartInstance();
    if (chart) {
      chart.destroy();
      this.chartInstance.set(null);
    }
  }
}
