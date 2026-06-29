import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, signal, computed, effect, AfterViewInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';



@Component({
  selector: 'app-compound-interest-calculator',
  templateUrl: './compound-interest-calculator.html',
  styleUrl: './compound-interest-calculator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterLink]
})
export class CompoundInterestCalculatorComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  @ViewChild('compoundInterestChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;

  // Input signals for the calculator
  principal = signal(1000);
  interestRate = signal(5); // as a percentage
  compoundingFrequency = signal(12); // monthly
  timePeriod = signal(10); // years

  // Validation signals for inputs
  isPrincipalValid = signal(true);
  isInterestRateValid = signal(true);
  isCompoundingFrequencyValid = signal(true);
  isTimePeriodValid = signal(true);

  // Computed signal for the calculated compound interest
  compoundInterest = computed(() => {
    const p = this.principal();
    const r = this.interestRate() / 100;
    const n = this.compoundingFrequency();
    const t = this.timePeriod();

    // Return 0 if any input is invalid or negative
    if (p <= 0 || r < 0 || n <= 0 || t <= 0) {
      return 0;
    }

    // Compound interest formula: A = P(1 + r/n)^(nt) - P
    const amount = p * Math.pow((1 + (r / n)), (n * t));
    return amount - p;
  });

  // Computed signal for the total amount after compounding
  totalAmount = computed(() => {
    const p = this.principal();
    const r = this.interestRate() / 100;
    const n = this.compoundingFrequency();
    const t = this.timePeriod();

    // Return principal if any input is invalid or negative
    if (p <= 0 || r < 0 || n <= 0 || t <= 0) {
      return p;
    }
    // Total amount formula: A = P(1 + r/n)^(nt)
    return p * Math.pow((1 + (r / n)), (n * t));
  });

  // Computed signal to check if all inputs are valid for calculation and chart rendering
  areInputsValid = computed(() => {
    return this.isPrincipalValid() &&
           this.isInterestRateValid() &&
           this.isCompoundingFrequencyValid() &&
           this.isTimePeriodValid();
  });

  constructor() {
    // Effect to validate inputs and trigger chart update when any input signal changes
    effect(() => {
      this.validateInputs();
      // Debounce chart update to prevent flickering during rapid input changes
      setTimeout(() => this.updateChart(), 0);
    });
  }

  ngAfterViewInit() {
    // Initial chart render after the view has been initialized
    this.renderChart();
  }

  ngOnDestroy() {
    // Destroy the chart instance to prevent memory leaks
    if (this.chart) {
      this.chart.destroy();
    }
  }

  /**
   * Validates all input signals and updates the respective validation flags.
   */
  validateInputs(): void {
    this.isPrincipalValid.set(this.principal() > 0);
    this.isInterestRateValid.set(this.interestRate() >= 0);
    this.isCompoundingFrequencyValid.set(this.compoundingFrequency() > 0);
    this.isTimePeriodValid.set(this.timePeriod() > 0);
  }

  /**
   * Clears all input values and resets validation states to their initial defaults.
   */
  clearInputs(): void {
    this.principal.set(1000);
    this.interestRate.set(5);
    this.compoundingFrequency.set(12);
    this.timePeriod.set(10);
    this.validateInputs(); // Re-validate after clearing to update UI
  }

  /**
   * Renders the bar chart visualizing the compound interest growth over time.
   */
  renderChart() {
    if (!isPlatformBrowser(this.platformId)) return;
    Chart.register(...registerables);

    // Only render if inputs are valid and canvas is available
    if (!this.chartCanvas || !this.areInputsValid()) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart before rendering a new one to prevent duplicates
    if (this.chart) {
      this.chart.destroy();
    }

    const p = this.principal();
    const r = this.interestRate() / 100;
    const n = this.compoundingFrequency();
    const t = this.timePeriod();

    // Prepare data for the chart
    const labels: string[] = [];
    const principalData: number[] = [];
    const interestData: number[] = [];
    let currentPrincipal = p;
    let cumulativeInterest = 0;

    // Calculate values year by year for the chart
    for (let year = 0; year <= t; year++) {
      labels.push(`Year ${year}`);
      if (year === 0) {
        principalData.push(p);
        interestData.push(0); // No interest at year 0
      } else {
        // Calculate interest accrued in this year
        const yearInterestAccrued = currentPrincipal * (Math.pow((1 + (r / n)), n) - 1);
        cumulativeInterest += yearInterestAccrued;
        currentPrincipal += yearInterestAccrued;
        principalData.push(p); // Original principal remains constant for this dataset
        interestData.push(cumulativeInterest);
      }
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Initial Principal',
            data: principalData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Compound Interest Earned',
            data: interestData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Compound Interest Growth Over Time',
            color: '#333',
            font: { size: 16 }
          },
          legend: {
            labels: {
              color: '#333'
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year',
              color: '#333'
            },
            ticks: {
              color: '#555'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Amount (₹)',
              color: '#333'
            },
            ticks: {
              color: '#555'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            stacked: true, // Stack bars to show total growth
          },
        },
      },
    });
  }

  /**
   * Destroys the existing chart and re-renders it. Called when input signals change.
   */
  updateChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    this.renderChart();
  }
}
