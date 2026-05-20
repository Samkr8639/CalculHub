import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule, DecimalPipe } from '@angular/common';

type Chart = import('chart.js').Chart;
type ChartData = import('chart.js').ChartData;
type ChartOptions = import('chart.js').ChartOptions;

@Component({
  selector: 'app-bike-loan-emi-calculator',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './bike-loan-emi-calculator.html',
  styleUrls: ['./bike-loan-emi-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BikeLoanEmiCalculatorComponent {
  loanAmount = signal<number | null>(200000);
  interestRate = signal<number | null>(10);
  loanTenure = signal<number | null>(5);

  monthlyEMI = signal<number | null>(null);
  totalInterest = signal<number | null>(null);
  totalPayment = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('emiChart');
  private platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        if (this.chartCanvas() && this.monthlyEMI() !== null) {
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
    this.calculateEMI();
  }

  onInputChange(event: Event, signalSetter: (value: number | null) => void) {
    const value = (event.target as HTMLInputElement).value;
    signalSetter(parseFloat(value) || null);
    this.calculateEMI();
  }

  calculateEMI() {
    const principal = this.loanAmount() ?? 0;
    const annualRate = this.interestRate() ?? 0;
    const years = this.loanTenure() ?? 0;

    if (principal > 0 && annualRate > 0 && years > 0) {
      const monthlyRate = annualRate / 12 / 100;
      const numberOfMonths = years * 12;

      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
      const totalPayment = emi * numberOfMonths;
      const totalInterest = totalPayment - principal;

      this.monthlyEMI.set(emi);
      this.totalInterest.set(totalInterest);
      this.totalPayment.set(totalPayment);
    } else {
      this.clearCalculations();
    }
  }

  private generateChartData() {
    const principal = this.loanAmount() ?? 0;
    const interest = this.totalInterest() ?? 0;

    return {
      labels: ['Principal Loan Amount', 'Total Interest'],
      data: [principal, interest],
    };
  }

  private async createChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;

    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);

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
    this.monthlyEMI.set(null);
    this.totalInterest.set(null);
    this.totalPayment.set(null);
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
