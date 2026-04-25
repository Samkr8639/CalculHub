import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-statistics-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './statistics-calculator.html',
  styleUrls: ['./statistics-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsCalculator {
  // Signals for the input and results
  public data = signal('');
  public mean = signal<number | null>(null);
  public median = signal<number | null>(null);
  public mode = signal<number[] | null>(null);
  public standardDeviation = signal<number | null>(null);
  public variance = signal<number | null>(null);
  public p25 = signal<number | null>(null);
  public p75 = signal<number | null>(null);
  public iqr = signal<number | null>(null);
  public error = signal<string | null>(null);

  // Computed signal to parse the input string into an array of numbers
  private parsedData = computed(() => {
    const rawData = this.data();
    if (!rawData.trim()) {
      return [];
    }
    const numbers = rawData.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (numbers.length === 0 && rawData.trim().length > 0) {
        throw new Error('Invalid input. Please ensure you enter comma-separated numbers.');
    }
    return numbers;
  });

  public onDataChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.data.set(inputElement.value);
  }

  public calculate(): void {
    this.clearResults();
    this.error.set(null);

    try {
      const data = this.parsedData();
      if (data.length === 0) {
        if(this.data().trim().length > 0) {
           this.error.set('Invalid input. Please enter valid, comma-separated numbers.');
        } else {
           this.error.set('No data to calculate. Please enter some numbers.');
        }
        return;
      }

      // --- Calculations based on your provided algorithms ---
      const mean = this.calculateMean(data);
      const median = this.calculateMedian(data);
      const mode = this.calculateMode(data);
      const variance = this.calculateSampleVariance(data, mean);
      const standardDeviation = this.calculateSampleStandardDeviation(variance);
      const { q1, q3 } = this.calculateQuartiles(data);
      const iqr = (q1 !== null && q3 !== null) ? q3 - q1 : null;
      
      // --- Set all result signals ---
      this.mean.set(mean);
      this.median.set(median);
      this.mode.set(mode);
      this.variance.set(variance);
      this.standardDeviation.set(standardDeviation);
      this.p25.set(q1);
      this.p75.set(q3);
      this.iqr.set(iqr);

    } catch (e: unknown) {
      if (e instanceof Error) {
        this.error.set(e.message);
      } else {
        this.error.set('An unknown error occurred during calculation.');
      }
      this.clearResults();
    }
  }

  public clearResults(): void {
    this.mean.set(null);
    this.median.set(null);
    this.mode.set(null);
    this.standardDeviation.set(null);
    this.variance.set(null);
    this.p25.set(null);
    this.p75.set(null);
    this.iqr.set(null);
  }

  // --- Algorithm Implementations ---

  private calculateMean(data: number[]): number {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
  }

  private calculateMedian(data: number[]): number {
    const sortedData = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
      return (sortedData[mid - 1] + sortedData[mid]) / 2;
    } else {
      return sortedData[mid];
    }
  }

  private calculateMode(data: number[]): number[] | null {
    const counts: { [key: number]: number } = {};
    data.forEach(num => {
      counts[num] = (counts[num] || 0) + 1;
    });

    let maxCount = 0;
    for (const num in counts) {
      if (counts[num] > maxCount) {
        maxCount = counts[num];
      }
    }

    if (maxCount <= 1 && new Set(data).size === data.length) {
        return null; // No mode if all values are unique
    }

    const modes: number[] = [];
    for (const num in counts) {
      if (counts[num] === maxCount) {
        modes.push(parseFloat(num));
      }
    }
    return modes;
  }
  
  private calculateSampleVariance(data: number[], mean: number): number {
    if (data.length <= 1) {
      return 0; // Variance of a single point is 0, and undefined for zero points.
    }
    const sumSquaredDiffs = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    return sumSquaredDiffs / (data.length - 1);
  }

  private calculateSampleStandardDeviation(variance: number): number {
    return Math.sqrt(variance);
  }
  
  private getPercentile(sortedData: number[], percentile: number): number | null {
    if (sortedData.length === 0) {
        return null;
    }
    // Using the (n-1) method which is common (e.g. `PERCENTILE.INC` in Excel)
    const index = (percentile / 100) * (sortedData.length - 1);
    if (Number.isInteger(index)) {
        return sortedData[index];
    }
    const lower = Math.floor(index);
    const upper = lower + 1;
    const weight = index - lower;
    return sortedData[lower] * (1 - weight) + sortedData[upper] * weight;
  }

  private calculateQuartiles(data: number[]): { q1: number | null, q3: number | null } {
    const sortedData = [...data].sort((a, b) => a - b);
    const q1 = this.getPercentile(sortedData, 25);
    const q3 = this.getPercentile(sortedData, 75);
    return { q1, q3 };
  }
}
