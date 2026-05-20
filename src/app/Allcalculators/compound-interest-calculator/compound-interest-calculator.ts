import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Chart = import('chart.js').Chart;
type ChartData = import('chart.js').ChartData;
type ChartOptions = import('chart.js').ChartOptions;


@Component({
  selector: 'app-compound-interest-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './compound-interest-calculator.html',
  styleUrls: ['./compound-interest-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompoundInterestCalculatorComponent {
  principalAmount = signal<number | null>(100000);
  annualInterestRate = signal<number | null>(5);
  compoundingFrequency = signal<number | null>(12); // Default to monthly
  timeInYears = signal<number | null>(10);

  futureValue = signal<number | null>(null);
  totalInterest = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('interestChart');
  private platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        if (this.chartCanvas() && this.futureValue() !== null) {
          if (this.chartInstance()) {
            this.updateChart();
          } else {
            this.createChart();
          }
        } else if (this.chartInstance()) {
          this.clearChart();
        }
      }
    });
    this.calculateInterest();
  }

  onPrincipalChange(event: Event) {
    this.principalAmount.set(this.parseValue(event));
    this.calculateInterest();
  }

  onRateChange(event: Event) {
    this.annualInterestRate.set(this.parseValue(event));
    this.calculateInterest();
  }

  onTimeChange(event: Event) {
    this.timeInYears.set(this.parseValue(event));
    this.calculateInterest();
  }

  onFrequencyChange(event: Event) {
    this.compoundingFrequency.set(this.parseValue(event));
    this.calculateInterest();
  }

  private parseValue(event: Event): number | null {
    const value = (event.target as HTMLInputElement).value;
    return parseFloat(value) || null;
  }

  calculateInterest() {
    const P = this.principalAmount() ?? 0;
    const r = (this.annualInterestRate() ?? 0) / 100;
    const n = this.compoundingFrequency() ?? 0;
    const t = this.timeInYears() ?? 0;

    if (P > 0 && r > 0 && n > 0 && t > 0) {
      const amount = P * Math.pow(1 + r / n, n * t);
      const interest = amount - P;
      this.futureValue.set(amount);
      this.totalInterest.set(interest);
    } else {
      this.clearResults();
    }
  }

  private generateChartData() {
    const principal = this.principalAmount() ?? 0;
    const interest = this.totalInterest() ?? 0;
    return { 
      labels: ['Principal Amount', 'Total Interest'], 
      data: [principal, interest] 
    };
  }

  private async createChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;

    const { Chart, registerables } = await import('chart.js/auto');
    Chart.register(...registerables);

    const { labels, data } = this.generateChartData();

    const chartData: ChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#3b82f6', '#ef4444'],
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

  clearInputs() {
    this.principalAmount.set(null);
    this.annualInterestRate.set(null);
    this.compoundingFrequency.set(null);
    this.timeInYears.set(null);
    this.clearResults();
  }

  private clearResults() {
    this.futureValue.set(null);
    this.totalInterest.set(null);
  }

  private clearChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    const chart = this.chartInstance();
    if (chart) {
      chart.destroy();
      this.chartInstance.set(null);
    }
  }
}
