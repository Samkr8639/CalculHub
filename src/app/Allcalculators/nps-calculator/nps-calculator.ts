import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nps-calculator',
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './nps-calculator.html',
  styleUrls: ['./nps-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NpsCalculatorComponent {
  private platformId = inject(PLATFORM_ID);

  monthlyContribution = signal<number | null>(5000);
  expectedReturn = signal<number | null>(10);
  annuityRate = signal<number | null>(6);
  currentAge = signal<number | null>(30);
  retirementAge = signal<number | null>(60);

  totalCorpus = signal<number | null>(null);
  totalInvested = signal<number | null>(null);
  wealthGained = signal<number | null>(null);
  lumpsum = signal<number | null>(null);      // 60% withdrawal
  annuityCorpus = signal<number | null>(null); // 40% annuity
  monthlyPension = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('npsChart');

  constructor() {
    effect(() => {
      if (this.chartCanvas() && this.totalCorpus() !== null) {
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
    const P = this.monthlyContribution() ?? 0;
    const r = (this.expectedReturn() ?? 0) / 100 / 12;
    const annuityR = (this.annuityRate() ?? 0) / 100 / 12;
    const currentAge = this.currentAge() ?? 0;
    const retirementAge = this.retirementAge() ?? 0;
    const n = (retirementAge - currentAge) * 12;

    if (P > 0 && r > 0 && n > 0 && currentAge < retirementAge) {
      const corpus = P * (Math.pow(1 + r, n) - 1) / r * (1 + r);
      const invested = P * n;

      const lumpsum = corpus * 0.6;
      const annuity = corpus * 0.4;
      const pension = annuityR > 0 ? annuity * annuityR / (1 - Math.pow(1 + annuityR, -240)) : 0; // 20-year annuity

      this.totalCorpus.set(corpus);
      this.totalInvested.set(invested);
      this.wealthGained.set(corpus - invested);
      this.lumpsum.set(lumpsum);
      this.annuityCorpus.set(annuity);
      this.monthlyPension.set(pension);
    } else {
      this.totalCorpus.set(null);
      this.totalInvested.set(null);
      this.wealthGained.set(null);
      this.lumpsum.set(null);
      this.annuityCorpus.set(null);
      this.monthlyPension.set(null);
    }
  }

  private createChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    Chart.register(...registerables);
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;
    const invested = this.totalInvested() ?? 0;
    const gained = this.wealthGained() ?? 0;
    const data: ChartData = {
      labels: ['Total Invested', 'Wealth Gained'],
      datasets: [{ data: [invested, gained], backgroundColor: ['#4299e1', '#68d391'], borderWidth: 1 }],
    };
    const options: ChartOptions = {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#ccc' } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ₹${(ctx.raw as number).toFixed(0)}` } },
      },
    };
    this.chartInstance.set(new Chart(canvas, { type: 'doughnut', data, options }));
  }

  private updateChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    const chart = this.chartInstance();
    if (chart) {
      chart.data.datasets[0].data = [this.totalInvested() ?? 0, this.wealthGained() ?? 0];
      chart.update();
    }
  }

  private clearChart() {
    const chart = this.chartInstance();
    if (chart) { chart.destroy(); this.chartInstance.set(null); }
  }
}
