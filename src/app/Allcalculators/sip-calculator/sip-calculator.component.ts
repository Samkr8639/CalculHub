import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';



@Component({
  selector: 'app-sip-calculator',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './sip-calculator.component.html',
  styleUrls: ['./sip-calculator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SipCalculatorComponent {
  private platformId = inject(PLATFORM_ID);

  monthlyInvestment = signal<number | null>(10000);
  annualReturnRate = signal<number | null>(12);
  investmentTenureYears = signal<number | null>(10);

  maturityAmount = signal<number | null>(null);
  totalInvested = signal<number | null>(null);
  estimatedGains = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('sipChart');

  constructor() {
    effect(() => {
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
    });

    // Initial calculation
    this.calculateSip();
  }

  onMonthlyInvestmentChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.monthlyInvestment.set(parseFloat(value) || null);
    this.calculateSip();
  }

  onAnnualReturnRateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.annualReturnRate.set(parseFloat(value) || null);
    this.calculateSip();
  }

  onInvestmentTenureChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.investmentTenureYears.set(parseFloat(value) || null);
    this.calculateSip();
  }

  calculateSip() {
    const P = this.monthlyInvestment();
    const r = this.annualReturnRate();
    const t = this.investmentTenureYears();

    if (P !== null && r !== null && t !== null && P > 0 && r >= 0 && t > 0) {
      const n = t * 12;
      const i = r / 100 / 12;

      const maturity = P * (Math.pow(1 + i, n) - 1) / i * (1 + i);
      const invested = P * n;
      const gains = maturity - invested;

      this.maturityAmount.set(maturity);
      this.totalInvested.set(invested);
      this.estimatedGains.set(gains);
    } else {
      this.clearCalculations();
    }
  }

  private generateChartData() {
    const P = this.monthlyInvestment();
    const r = this.annualReturnRate();
    const t = this.investmentTenureYears();
    const labels: string[] = [];
    const investedData: number[] = [];
    const maturityData: number[] = [];

    if (P !== null && r !== null && t !== null && P > 0 && r >= 0 && t > 0) {
      const i = r / 100 / 12;
      for (let year = 1; year <= t; year++) {
        const n = year * 12;
        const totalInvested = P * n;
        const endOfYearMaturity = P * (Math.pow(1 + i, n) - 1) / i * (1 + i);
        labels.push(`Year ${year}`);
        investedData.push(totalInvested);
        maturityData.push(endOfYearMaturity);
      }
    }

    return { labels, investedData, maturityData };
  }

  private createChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    Chart.register(...registerables);

    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;

    const { labels, investedData, maturityData } = this.generateChartData();

    const data: ChartData = {
      labels,
      datasets: [
        {
          label: 'Total Invested',
          data: investedData,
          backgroundColor: '#4299e1',
          borderColor: '#4299e1',
          borderWidth: 1,
        },
        {
          label: 'Maturity Value',
          data: maturityData,
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
      const { labels, investedData, maturityData } = this.generateChartData();
      chart.data.labels = labels;
      chart.data.datasets[0].data = investedData;
      chart.data.datasets[1].data = maturityData;
      chart.update();
    }
  }

  private clearCalculations() {
    this.maturityAmount.set(null);
    this.totalInvested.set(null);
    this.estimatedGains.set(null);
  }
  
  private clearChart() {
    const chart = this.chartInstance();
    if (chart) {
        chart.destroy();
        this.chartInstance.set(null);
    }
  }
}
