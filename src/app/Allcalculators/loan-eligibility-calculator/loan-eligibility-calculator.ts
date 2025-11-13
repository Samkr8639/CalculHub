import { ChangeDetectionStrategy, Component, signal, effect, ElementRef, viewChild, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-loan-eligibility-calculator',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './loan-eligibility-calculator.html',
  styleUrls: ['./loan-eligibility-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanEligibilityCalculatorComponent {
  monthlyIncome = signal<number | null>(50000);
  monthlyDebt = signal<number | null>(10000);
  interestRate = signal<number | null>(8.5);
  loanTenure = signal<number | null>(20);

  maxLoanAmount = signal<number | null>(null);
  monthlyEmi = signal<number | null>(null);
  totalPayable = signal<number | null>(null);
  totalInterest = signal<number | null>(null);

  private chartInstance = signal<Chart | null>(null);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('affordabilityChart');

  constructor() {
    effect(() => {
      const canvas = this.chartCanvas();
      if (canvas && this.maxLoanAmount() !== null) {
        if (this.chartInstance()) {
          this.updateChart();
        } else {
          this.createChart();
        }
      } else if (this.chartInstance()) {
        this.clearChart();
      }
    });
    this.calculateLoanEligibility();
  }

  onMonthlyIncomeChange(event: Event) {
    this.monthlyIncome.set(this.parseInput(event));
    this.calculateLoanEligibility();
  }

  onMonthlyDebtChange(event: Event) {
    this.monthlyDebt.set(this.parseInput(event));
    this.calculateLoanEligibility();
  }

  onInterestRateChange(event: Event) {
    this.interestRate.set(this.parseInput(event));
    this.calculateLoanEligibility();
  }

  onLoanTenureChange(event: Event) {
    this.loanTenure.set(this.parseInput(event));
    this.calculateLoanEligibility();
  }

  private parseInput(event: Event): number | null {
    const value = (event.target as HTMLInputElement).value;
    return parseFloat(value) || null;
  }

  calculateLoanEligibility() {
    const income = this.monthlyIncome() ?? 0;
    const debt = this.monthlyDebt() ?? 0;
    const rate = (this.interestRate() ?? 0) / 100 / 12;
    const tenure = (this.loanTenure() ?? 0) * 12;

    if (income > 0 && rate > 0 && tenure > 0) {
      const maxEmi = (income * 0.5) - debt;
      if (maxEmi > 0) {
        const loanAmount = maxEmi * ((Math.pow(1 + rate, tenure) - 1) / (rate * Math.pow(1 + rate, tenure)));
        const totalPayment = maxEmi * tenure;
        const totalInterestPaid = totalPayment - loanAmount;

        this.maxLoanAmount.set(loanAmount);
        this.monthlyEmi.set(maxEmi);
        this.totalPayable.set(totalPayment);
        this.totalInterest.set(totalInterestPaid);

      } else {
        this.clearCalculations();
      }
    } else {
      this.clearCalculations();
    }
  }

  private generateChartData() {
    const principal = this.maxLoanAmount() ?? 0;
    const interest = this.totalInterest() ?? 0;

    return {
      labels: ['Principal Amount', 'Total Interest'],
      data: [principal, interest],
    };
  }

  private createChart() {
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
    const chart = this.chartInstance();
    if (chart) {
      chart.data.datasets[0].data = this.generateChartData().data;
      chart.update();
    }
  }
  private clearCalculations() {
    this.maxLoanAmount.set(null);
    this.monthlyEmi.set(null);
    this.totalPayable.set(null);
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
