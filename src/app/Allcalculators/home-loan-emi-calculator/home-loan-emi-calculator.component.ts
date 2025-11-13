import { ChangeDetectionStrategy, Component, signal, computed, effect, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-home-loan-emi-calculator',
  imports: [CommonModule],
  templateUrl: './home-loan-emi-calculator.component.html',
  styleUrls: ['./home-loan-emi-calculator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLoanEmiCalculatorComponent implements AfterViewInit, OnDestroy {
  loanAmount = signal<number | null>(5000000);
  interestRate = signal<number | null>(8);
  loanTenure = signal<number | null>(20);

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  constructor() {
    effect(() => {
      this.updateChart();
    });
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  calculationResults = computed(() => {
    const principal = this.loanAmount();
    const annualRate = this.interestRate();
    const tenureYears = this.loanTenure();

    if (principal === null || annualRate === null || tenureYears === null || principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
      return null;
    }

    const monthlyRate = annualRate / 12 / 100;
    const numberOfMonths = tenureYears * 12;

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
    const totalPayment = emi * numberOfMonths;
    const totalInterest = totalPayment - principal;

    return {
      emi: emi,
      totalInterest: totalInterest,
      totalPayment: totalPayment,
      principal: principal
    };
  });

  updateChart() {
    const results = this.calculationResults();
    if (this.chart && results) {
      this.chart.data.labels = ['Principal', 'Interest'];
      this.chart.data.datasets[0].data = [results.principal, results.totalInterest];
      this.chart.update();
    }
  }

  renderChart() {
    const results = this.calculationResults();
    if (this.chartCanvas && results) {
      const chartConfig: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: ['Principal', 'Interest'],
          datasets: [{
            label: 'Loan Breakdown',
            data: [results.principal, results.totalInterest],
            backgroundColor: ['#36A2EB', '#FF6384']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw as number;
                  return ` ${value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => {
                  const numValue = typeof value === 'string' ? parseFloat(value) : value;
                  return numValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
                }
              }
            }
          }
        }
      };

      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(this.chartCanvas.nativeElement, chartConfig);
    }
  }

  onLoanAmountChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.loanAmount.set(Number(value));
  }

  onInterestRateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.interestRate.set(Number(value));
  }

  onLoanTenureChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.loanTenure.set(Number(value));
  }
}
