import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lumpsum-calculator',
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './lumpsum-calculator.html',
  styleUrls: ['./lumpsum-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumpsumCalculatorComponent {
  private platformId = inject(PLATFORM_ID);

  principal = signal<number | null>(100000);
  annualReturn = signal<number | null>(12);
  tenure = signal<number | null>(10);

  maturityAmount = signal<number | null>(null);
  wealthGained = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('lumpsumChart');

  constructor() {
    effect(() => {
      if (this.chartCanvas() && this.maturityAmount() !== null) {
        if (this.chartInstance()) { this.updateChart(); } else { this.createChart(); }
      } else if (this.chartInstance()) { this.clearChart(); }
    });
    this.calculate();
  }

  onInputChange(event: Event, signalSetter: (value: number | null) => void) {
    const value = (event.target as HTMLInputElement).value;
    signalSetter(parseFloat(value) || null);
    this.calculate();
  }

  calculate() {
    const P = this.principal() ?? 0;
    const r = (this.annualReturn() ?? 0) / 100;
    const t = this.tenure() ?? 0;

    if (P > 0 && r >= 0 && t > 0) {
      const maturity = P * Math.pow(1 + r, t);
      this.maturityAmount.set(maturity);
      this.wealthGained.set(maturity - P);
    } else {
      this.maturityAmount.set(null);
      this.wealthGained.set(null);
    }
  }

  private generateChartData() {
    const P = this.principal() ?? 0;
    const r = (this.annualReturn() ?? 0) / 100;
    const t = this.tenure() ?? 0;
    const labels: string[] = [];
    const investedData: number[] = [];
    const maturityData: number[] = [];

    for (let year = 1; year <= t; year++) {
      labels.push(`Year ${year}`);
      investedData.push(P);
      maturityData.push(P * Math.pow(1 + r, year));
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
        { label: 'Invested Amount', data: investedData, backgroundColor: '#4299e1', borderColor: '#4299e1', borderWidth: 1 },
        { label: 'Maturity Value', data: maturityData, backgroundColor: '#68d391', borderColor: '#68d391', borderWidth: 1 },
      ],
    };
    const options: ChartOptions = {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { color: '#ccc' } },
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#ccc', callback: (v) => `₹${Number(v) / 1000}k` } },
      },
      plugins: {
        legend: { labels: { color: '#ccc' } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ₹${(ctx.raw as number).toFixed(0)}` } },
      },
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

  private clearChart() {
    const chart = this.chartInstance();
    if (chart) { chart.destroy(); this.chartInstance.set(null); }
  }
}
