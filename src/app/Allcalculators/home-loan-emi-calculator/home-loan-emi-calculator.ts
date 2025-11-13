import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-home-loan-emi-calculator',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './home-loan-emi-calculator.html',
  styleUrls: ['./home-loan-emi-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLoanEmiCalculatorComponent {
  loanAmount = signal<number | null>(5000000);
  interestRate = signal<number | null>(8);
  loanTenure = signal<number | null>(20);

  monthlyEmi = signal<number | null>(null);
  totalPayable = signal<number | null>(null);
  totalInterest = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('emiChart');

  constructor() {
    effect(() => {
      if (this.chartCanvas() && this.monthlyEmi() !== null) {
        if (this.chartInstance()) {
          this.updateChart();
        } else {
          this.createChart();
        }
      } else if (this.chartInstance()) {
        this.clearChart();
      }
    });
    this.calculateEmi();
  }

  onLoanAmountChange(event: Event) {
    this.loanAmount.set(this.parseInput(event));
    this.calculateEmi();
  }

  onInterestRateChange(event: Event) {
    this.interestRate.set(this.parseInput(event));
    this.calculateEmi();
  }

  onLoanTenureChange(event: Event) {
    this.loanTenure.set(this.parseInput(event));
    this.calculateEmi();
  }

  private parseInput(event: Event): number | null {
    const value = (event.target as HTMLInputElement).value;
    return parseFloat(value) || null;
  }

  calculateEmi() {
    const P = this.loanAmount() ?? 0;
    const R = this.interestRate() ?? 0;
    const N = this.loanTenure() ?? 0;

    if (P > 0 && R > 0 && N > 0) {
      const r = R / 12 / 100;
      const n = N * 12;
      const emi = P * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
      const totalPayment = emi * n;
      const totalInterestPaid = totalPayment - P;

      this.monthlyEmi.set(emi);
      this.totalPayable.set(totalPayment);
      this.totalInterest.set(totalInterestPaid);
    } else {
      this.clearCalculations();
    }
  }

  private generateChartData() {
    const principal = this.loanAmount() ?? 0;
    const interest = this.totalInterest() ?? 0;

    return {
      labels: ['Principal Amount', 'Total Interest'],
      data: [principal, interest],
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
          data,
          backgroundColor: ['#36a2eb', '#ff6384'],
          borderWidth: 1,
        },
      ],
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#ccc' },
        },
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

    this.chartInstance.set(new Chart(canvas, { type: 'doughnut', data: chartData, options }));
  }

  private updateChart() {
    const chart = this.chartInstance();
    if (chart) {
      chart.data.datasets[0].data = this.generateChartData().data;
      chart.update();
    }
  }

  private clearCalculations() {
    this.monthlyEmi.set(null);
    this.totalPayable.set(null);
    this.totalInterest.set(null);
  }

  private clearChart() {
    const chart = this.chartInstance();
    if (chart) {
      chart.destroy();
      this.chartInstance.set(null);
    }
  }
}
