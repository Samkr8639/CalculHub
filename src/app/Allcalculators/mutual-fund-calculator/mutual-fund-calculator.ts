import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, computed, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';



@Component({
  selector: 'app-mutual-fund-calculator',
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './mutual-fund-calculator.html',
  styleUrls: ['./mutual-fund-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MutualFundCalculatorComponent {
  private platformId = inject(PLATFORM_ID);

  initialInvestment = signal<number | null>(100000);
  monthlyContribution = signal<number | null>(5000);
  investmentPeriod = signal<number | null>(10);
  annualReturn = signal<number | null>(12);

  futureValue = signal<number | null>(null);
  totalInvestment = signal<number | null>(null);
  totalReturns = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('returnsChart');

  constructor() {
    effect(() => {
      const canvas = this.chartCanvas();
      if (canvas && this.futureValue() !== null) {
        if (this.chartInstance()) {
          this.updateChart();
        } else {
          this.createChart();
        }
      } else if (this.chartInstance()) {
        this.clearChart();
      }
    });
    this.calculateReturns();
  }

  onInitialInvestmentChange(event: Event) {
    this.initialInvestment.set(this.parseInput(event));
    this.calculateReturns();
  }

  onMonthlyContributionChange(event: Event) {
    this.monthlyContribution.set(this.parseInput(event));
    this.calculateReturns();
  }

  onInvestmentPeriodChange(event: Event) {
    this.investmentPeriod.set(this.parseInput(event));
    this.calculateReturns();
  }

  onAnnualReturnChange(event: Event) {
    this.annualReturn.set(this.parseInput(event));
    this.calculateReturns();
  }

  private parseInput(event: Event): number | null {
    const value = (event.target as HTMLInputElement).value;
    return parseFloat(value) || null;
  }

  calculateReturns() {
    const P = this.initialInvestment() ?? 0;
    const M = this.monthlyContribution() ?? 0;
    const t = this.investmentPeriod() ?? 0;
    const r = (this.annualReturn() ?? 0) / 100;

    if (t > 0 && r > 0) {
      const n = 12; // Compounded monthly
      const rate = r / n;
      const periods = t * n;

      const lumpSumFV = P * Math.pow(1 + rate, periods);
      const sipFV = M * ((Math.pow(1 + rate, periods) - 1) / rate) * (1 + rate);
      
      const totalFV = lumpSumFV + sipFV;
      const totalInvested = P + (M * periods);
      const returns = totalFV - totalInvested;

      this.futureValue.set(totalFV);
      this.totalInvestment.set(totalInvested);
      this.totalReturns.set(returns);
    } else {
      this.clearCalculations();
    }
  }

  private generateChartData() {
    const investment = this.totalInvestment() ?? 0;
    const returns = this.totalReturns() ?? 0;

    return {
      labels: ['Total Investment', 'Total Returns'],
      data: [investment, returns],
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
          backgroundColor: ['#4299e1', '#68d391'],
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
    if (!isPlatformBrowser(this.platformId)) return;

    const chart = this.chartInstance();
    if (chart) {
      chart.data.datasets[0].data = this.generateChartData().data;
      chart.update();
    }
  }

  private clearCalculations() {
    this.futureValue.set(null);
    this.totalInvestment.set(null);
    this.totalReturns.set(null);
  }

  private clearChart() {
    const chart = this.chartInstance();
    if (chart) {
      chart.destroy();
      this.chartInstance.set(null);
    }
  }
}
