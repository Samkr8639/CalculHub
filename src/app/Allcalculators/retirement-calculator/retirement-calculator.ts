import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule, DecimalPipe } from '@angular/common';

type Chart = import('chart.js').Chart;
type ChartData = import('chart.js').ChartData;
type ChartOptions = import('chart.js').ChartOptions;

@Component({
  selector: 'app-retirement-calculator',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './retirement-calculator.html',
  styleUrls: ['./retirement-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetirementCalculatorComponent {
  currentAge = signal<number | null>(30);
  retirementAge = signal<number | null>(60);
  currentSavings = signal<number | null>(500000);
  monthlyContribution = signal<number | null>(20000);
  annualReturnRate = signal<number | null>(10);

  retirementCorpus = signal<number | null>(null);
  totalInvestment = signal<number | null>(null);
  totalInterest = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('retirementChart');
  private platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
        if (isPlatformBrowser(this.platformId)) {
            if (this.chartCanvas() && this.retirementCorpus() !== null) {
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
    this.calculateRetirement();
  }

  onInputChange(event: Event, signalSetter: (value: number | null) => void) {
    const value = (event.target as HTMLInputElement).value;
    signalSetter(parseFloat(value) || null);
    this.calculateRetirement();
  }

  calculateRetirement() {
    const currentAge = this.currentAge() ?? 0;
    const retirementAge = this.retirementAge() ?? 0;
    const currentSavings = this.currentSavings() ?? 0;
    const monthlyContribution = this.monthlyContribution() ?? 0;
    const annualReturnRate = this.annualReturnRate() ?? 0;

    if (currentAge > 0 && retirementAge > currentAge && annualReturnRate > 0) {
      const yearsToRetirement = retirementAge - currentAge;
      const monthsToRetirement = yearsToRetirement * 12;
      const monthlyReturnRate = annualReturnRate / 12 / 100;

      const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + annualReturnRate / 100, yearsToRetirement);
      const futureValueOfMonthlyContributions = monthlyContribution * ((Math.pow(1 + monthlyReturnRate, monthsToRetirement) - 1) / monthlyReturnRate);

      const totalCorpus = futureValueOfCurrentSavings + futureValueOfMonthlyContributions;
      const totalInvested = currentSavings + (monthlyContribution * monthsToRetirement);
      const interestEarned = totalCorpus - totalInvested;

      this.retirementCorpus.set(totalCorpus);
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
    this.retirementCorpus.set(null);
    this.totalInvestment.set(null);
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
