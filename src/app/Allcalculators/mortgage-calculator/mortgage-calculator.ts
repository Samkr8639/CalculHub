import { CommonModule, CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, OnDestroy, signal, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Chart = import('chart.js').Chart;

interface AmortizationEntry {
  month: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
  cumulativeInterest: number;
}


@Component({
  selector: 'app-mortgage-calculator',
  imports: [CommonModule, FormsModule, CurrencyPipe,],
  templateUrl: './mortgage-calculator.html',
  styleUrl: './mortgage-calculator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MortgageCalculator implements AfterViewInit, OnDestroy{
  @ViewChild('amortizationChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;

  loanAmount = signal<number | null>(null);
  interestRate = signal<number | null>(null); // Annual interest rate percentage
  loanTermYears = signal<number | null>(null);
  loanTermUnit = signal<'years' | 'months'>('years');

  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Effect to re-render chart when relevant signals change
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        // Trigger chart update if any of these signals change
        this.loanAmount();
        this.interestRate();
        this.loanTermYears();
        this.loanTermUnit();
        // Debounce the chart update to avoid excessive re-renders
        setTimeout(() => this.updateChart(), 0);
      }
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.renderChart();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.chart) {
        this.chart.destroy();
      }
    }
  }

  monthlyPayment = computed<number | null>(() => {
    const principal = this.loanAmount();
    const annualRate = this.interestRate();
    const term = this.loanTermYears();
    const unit = this.loanTermUnit();

    if (principal === null || annualRate === null || term === null || principal <= 0 || annualRate < 0 || term <= 0) {
      return null;
    }

    const monthlyRate = annualRate / 100 / 12; // Convert annual percentage to monthly decimal
    const numberOfPayments = unit === 'years' ? term * 12 : term;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return isFinite(payment) ? payment : null;
  });

  amortizationSchedule = computed<AmortizationEntry[] | null>(() => {
    const principal = this.loanAmount();
    const annualRate = this.interestRate();
    const term = this.loanTermYears();
    const unit = this.loanTermUnit();
    const monthlyPay = this.monthlyPayment();

    if (principal === null || annualRate === null || term === null || monthlyPay === null || principal <= 0 || annualRate < 0 || term <= 0) {
      return null;
    }

    const schedule: AmortizationEntry[] = [];
    let remainingBalance = principal;
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = unit === 'years' ? term * 12 : term;
    let cumulativeInterest = 0;

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      let principalPayment = monthlyPay - interestPayment;

      if (remainingBalance < principalPayment) {
        principalPayment = remainingBalance;
      }

      remainingBalance -= principalPayment;
      cumulativeInterest += interestPayment;

      schedule.push({
        month,
        principalPayment,
        interestPayment,
        remainingBalance: Math.max(0, remainingBalance), // Ensure balance doesn't go negative
        cumulativeInterest,
      });

      if (remainingBalance <= 0) {
        break;
      }
    }
    return schedule;
  });

  clearInputs() {
    this.loanAmount.set(null);
    this.interestRate.set(null);
    this.loanTermYears.set(null);
    this.loanTermUnit.set('years');
  }

  async renderChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const schedule = this.amortizationSchedule();

    const { Chart, registerables } = await import('chart.js/auto');
    Chart.register(...registerables);

    if (schedule && schedule.length > 0) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: schedule.map(entry => entry.month.toString()),
          datasets: [
            {
              label: 'Principal Paid',
              data: schedule.map(entry => entry.principalPayment),
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              fill: true,
              tension: 0.3
            },
            {
              label: 'Interest Paid',
              data: schedule.map(entry => entry.interestPayment),
              borderColor: '#FF9800',
              backgroundColor: 'rgba(255, 152, 0, 0.2)',
              fill: true,
              tension: 0.3
            },
            {
              label: 'Remaining Balance',
              data: schedule.map(entry => entry.remainingBalance),
              borderColor: '#2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.2)',
              fill: false,
              tension: 0.3,
              hidden: true // Hide by default
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Amortization Schedule',
              color: '#FFFFFF',
              font: { size: 16 }
            },
            legend: {
              labels: {
                color: '#FFFFFF'
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month',
                color: '#FFFFFF'
              },
              ticks: {
                color: '#8F8F8F'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Amount ($)',
                color: '#FFFFFF'
              },
              ticks: {
                color: '#8F8F8F'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
          },
        },
      });
    } else if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

  updateChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    this.renderChart();
  }
}
