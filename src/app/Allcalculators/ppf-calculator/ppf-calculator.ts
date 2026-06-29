import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, computed, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';



@Component({
  selector: 'app-ppf-calculator',
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './ppf-calculator.html',
  styleUrls: ['./ppf-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpfCalculatorComponent {
  private platformId = inject(PLATFORM_ID);

  yearlyInvestment = signal<number | null>(150000);
  investmentPeriod = signal<number | null>(15);
  annualRate = signal<number | null>(7.1);

  maturityValue = signal<number | null>(null);
  totalInvestment = signal<number | null>(null);
  totalInterest = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('returnsChart');

  constructor() {
    effect(() => {
      const canvas = this.chartCanvas();
      if (canvas && this.maturityValue() !== null) {
        if (this.chartInstance()) {
          this.updateChart();
        } else {
          this.createChart();
        }
      } else if (this.chartInstance()) {
        this.clearChart();
      }
    });
    this.calculatePpf();
  }

  onYearlyInvestmentChange(event: Event) {
    this.yearlyInvestment.set(this.parseInput(event));
    this.calculatePpf();
  }

  onInvestmentPeriodChange(event: Event) {
    this.investmentPeriod.set(this.parseInput(event));
    this.calculatePpf();
  }

  onAnnualRateChange(event: Event) {
    this.annualRate.set(this.parseInput(event));
    this.calculatePpf();
  }

  private parseInput(event: Event): number | null {
    const value = (event.target as HTMLInputElement).value;
    return parseFloat(value) || null;
  }

  calculatePpf() {
    const P = this.yearlyInvestment() ?? 0;
    const n = this.investmentPeriod() ?? 0;
    const i = (this.annualRate() ?? 0) / 100;

    if (P > 0 && n > 0 && i > 0) {
      const M = P * ((Math.pow(1 + i, n) - 1) / i);
      const totalInvested = P * n;
      const interest = M - totalInvested;

      this.maturityValue.set(M);
      this.totalInvestment.set(totalInvested);
      this.totalInterest.set(interest);
    } else {
      this.clearCalculations();
    }
  }

  private generateChartData() {
    const investment = this.totalInvestment() ?? 0;
    const interest = this.totalInterest() ?? 0;

    return {
      labels: ['Total Investment', 'Total Interest'],
      data: [investment, interest],
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
          data,
          backgroundColor: ['#3498db', '#2ecc71'],
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

    this.chartInstance.set(new Chart(canvas, { type: 'pie', data: chartData, options }));
  }

  private updateChart() {
    if (!isPlatformBrowser(this.platformId)) return;

    const chart = this.chartInstance();
    if (chart) {
      chart.data.datasets[0].data = this.generateChartData().data;
      chart.update();
    }
  }

  private clearCalculations() {
    this.maturityValue.set(null);
    this.totalInvestment.set(null);
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
