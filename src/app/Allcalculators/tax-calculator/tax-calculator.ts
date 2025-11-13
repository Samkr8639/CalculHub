import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-tax-calculator',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './tax-calculator.html',
  styleUrls: ['./tax-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxCalculatorComponent {
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

      // Simplified tax brackets for demonstration
      const taxBrackets = [
        { limit: 10000, rate: 0.10 },
        { limit: 40000, rate: 0.12 },
        { limit: 85000, rate: 0.22 },
        { limit: Infinity, rate: 0.24 },
      ];

      let tax = 0;
      let remainingIncome = taxable;
      let previousLimit = 0;

      for (const bracket of taxBrackets) {
        if (remainingIncome > 0) {
          const taxableInBracket = Math.min(remainingIncome, bracket.limit - previousLimit);
          tax += taxableInBracket * bracket.rate;
          remainingIncome -= taxableInBracket;
          previousLimit = bracket.limit;
        } else {
          break;
        }
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
