import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';



@Component({
  selector: 'app-investment-calculator',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './investment-calculator.html',
  styleUrls: ['./investment-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentCalculatorComponent {
  private platformId = inject(PLATFORM_ID);

  initialInvestment = signal<number | null>(100000);
  monthlyInvestment = signal<number | null>(10000);
  investmentPeriod = signal<number | null>(10);
  expectedReturnRate = signal<number | null>(12);

  futureValue = signal<number | null>(null);
  totalInvestment = signal<number | null>(null);
  totalInterest = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('investmentChart');

  constructor() {
    effect(() => {
      if (this.chartCanvas() && this.futureValue() !== null) {
        if (this.chartInstance()) {
          this.updateChart();
        } else {
          this.createChart();
        }
      } else if (this.chartInstance()) {
        this.clearChart();
      }
    });
    this.calculateInvestment();
  }

  onInputChange(event: Event, signalSetter: (value: number | null) => void) {
    const value = (event.target as HTMLInputElement).value;
    signalSetter(parseFloat(value) || null);
    this.calculateInvestment();
  }

  calculateInvestment() {
    const initialInvestment = this.initialInvestment() ?? 0;
    const monthlyInvestment = this.monthlyInvestment() ?? 0;
    const investmentPeriod = this.investmentPeriod() ?? 0;
    const expectedReturnRate = this.expectedReturnRate() ?? 0;

    if (investmentPeriod > 0 && expectedReturnRate > 0) {
      const monthlyRate = expectedReturnRate / 12 / 100;
      const months = investmentPeriod * 12;

      const futureValueOfInitial = initialInvestment * Math.pow(1 + expectedReturnRate / 100, investmentPeriod);
      const futureValueOfMonthly = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

      const totalValue = futureValueOfInitial + futureValueOfMonthly;
      const totalInvested = initialInvestment + (monthlyInvestment * months);
      const interestEarned = totalValue - totalInvested;

      this.futureValue.set(totalValue);
      this.totalInvestment.set(totalInvested);
      this.totalInterest.set(interestEarned);
    } else {
      this.clearCalculations();
    }
  }

  private generateChartData() {
    const principal = this.totalInvestment() ?? 0;
    const interest = this.totalInterest() ?? 0;

    return {
      labels: ['Total Investment', 'Total Interest'],
      data: [principal, interest],
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
