import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';

type Chart = import('chart.js').Chart;
type ChartData = import('chart.js').ChartData;
type ChartOptions = import('chart.js').ChartOptions;

@Component({
  selector: 'app-fd-calculator',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './fd-calculator.html',
  styleUrls: ['./fd-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FdCalculatorComponent {
  principalAmount = signal<number | null>(100000);
  interestRate = signal<number | null>(6.5);
  tenureYears = signal<number | null>(5);
  interestType = signal<'simple' | 'compound'>('compound');

  maturityAmount = signal<number | null>(null);
  totalInterest = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('fdChart');
  private platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const canvas = this.chartCanvas();
        if (canvas && this.maturityAmount() !== null) {
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
    this.calculateFd();
  }

  onPrincipalChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.principalAmount.set(parseFloat(value) || null);
    this.calculateFd();
  }

  onRateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.interestRate.set(parseFloat(value) || null);
    this.calculateFd();
  }

  onTenureChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.tenureYears.set(parseFloat(value) || null);
    this.calculateFd();
  }

  calculateFd() {
    const P = this.principalAmount();
    const r = this.interestRate();
    const t = this.tenureYears();

    if (P !== null && r !== null && t !== null && P > 0 && r >= 0 && t > 0) {
      let maturity = 0;
      let interest = 0;

      if (this.interestType() === 'simple') {
        interest = (P * r * t) / 100;
        maturity = P + interest;
      } else {
        // Assuming compounding quarterly
        const n = 4;
        maturity = P * Math.pow(1 + (r / 100 / n), n * t);
        interest = maturity - P;
      }

      this.maturityAmount.set(maturity);
      this.totalInterest.set(interest);
    } else {
      this.clearCalculations();
    }
  }

  private generateChartData() {
    const P = this.principalAmount();
    const r = this.interestRate();
    const t = this.tenureYears();
    const labels: string[] = [];
    const interestData: number[] = [];
    const principalData: number[] = [];

    if (P !== null && r !== null && t !== null && P > 0 && r >= 0 && t > 0) {
      for (let year = 1; year <= t; year++) {
        let interest = 0;
        if (this.interestType() === 'simple') {
          interest = (P * r * year) / 100;
        } else {
          const n = 4; // Compounded quarterly
          const maturity = P * Math.pow(1 + (r / 100 / n), n * year);
          interest = maturity - P;
        }
        labels.push(`Year ${year}`);
        principalData.push(P);
        interestData.push(interest);
      }
    }
    return { labels, principalData, interestData };
  }

  private async createChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;

    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);

    const { labels, principalData, interestData } = this.generateChartData();

    const data: ChartData = {
      labels,
      datasets: [
        {
          label: 'Principal Amount',
          data: principalData,
          backgroundColor: '#4299e1',
          borderColor: '#4299e1',
          borderWidth: 1,
        },
        {
          label: 'Total Interest',
          data: interestData,
          backgroundColor: '#68d391',
          borderColor: '#68d391',
          borderWidth: 1,
        }
      ]
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: '#ccc' },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { 
            color: '#ccc',
            callback: (value) => `₹${Number(value) / 1000}k`
          },
        },
      },
      plugins: {
        legend: { labels: { color: '#ccc' } },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.raw as number;
              return `${label}: ₹${value.toFixed(2)}`;
            }
          }
        }
      }
    };

    this.chartInstance.set(new Chart(canvas, { type: 'bar', data, options }));
  }

  private updateChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    const chart = this.chartInstance();
    if (chart) {
      const { labels, principalData, interestData } = this.generateChartData();
      chart.data.labels = labels;
      chart.data.datasets[0].data = principalData;
      chart.data.datasets[1].data = interestData;
      chart.update();
    }
  }

  private clearCalculations() {
    this.maturityAmount.set(null);
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
