import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cagr-calculator',
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './cagr-calculator.html',
  styleUrls: ['./cagr-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CagrCalculatorComponent {
  private platformId = inject(PLATFORM_ID);

  initialValue = signal<number | null>(100000);
  finalValue = signal<number | null>(250000);
  timePeriod = signal<number | null>(5);

  cagr = signal<number | null>(null);
  absoluteReturn = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('cagrChart');

  constructor() {
    effect(() => {
      if (this.chartCanvas() && this.cagr() !== null) {
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
    const IV = this.initialValue() ?? 0;
    const FV = this.finalValue() ?? 0;
    const t = this.timePeriod() ?? 0;

    if (IV > 0 && FV > 0 && t > 0) {
      const cagr = (Math.pow(FV / IV, 1 / t) - 1) * 100;
      const absoluteReturn = ((FV - IV) / IV) * 100;
      this.cagr.set(cagr);
      this.absoluteReturn.set(absoluteReturn);
    } else {
      this.cagr.set(null);
      this.absoluteReturn.set(null);
    }
  }

  private generateChartData() {
    const IV = this.initialValue() ?? 0;
    const cagr = (this.cagr() ?? 0) / 100;
    const t = this.timePeriod() ?? 0;
    const labels: string[] = ['Year 0'];
    const data: number[] = [IV];
    for (let i = 1; i <= t; i++) {
      labels.push(`Year ${i}`);
      data.push(IV * Math.pow(1 + cagr, i));
    }
    return { labels, data };
  }

  private createChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    Chart.register(...registerables);
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;
    const { labels, data } = this.generateChartData();
    const chartData: ChartData = {
      labels,
      datasets: [{ label: 'Value at CAGR', data, backgroundColor: '#68d391', borderColor: '#48bb78', borderWidth: 2, fill: true }],
    };
    const options: ChartOptions = {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { color: '#ccc' } },
        y: { beginAtZero: false, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#ccc', callback: (v) => `₹${Number(v) / 1000}k` } },
      },
      plugins: {
        legend: { labels: { color: '#ccc' } },
        tooltip: { callbacks: { label: (ctx) => `Value: ₹${(ctx.raw as number).toFixed(0)}` } },
      },
    };
    this.chartInstance.set(new Chart(canvas, { type: 'line', data: chartData, options }));
  }

  private updateChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    const chart = this.chartInstance();
    if (chart) {
      const { labels, data } = this.generateChartData();
      chart.data.labels = labels;
      chart.data.datasets[0].data = data;
      chart.update();
    }
  }

  private clearChart() {
    const chart = this.chartInstance();
    if (chart) { chart.destroy(); this.chartInstance.set(null); }
  }
}
