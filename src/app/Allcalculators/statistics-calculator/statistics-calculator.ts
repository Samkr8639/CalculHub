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
  public error = signal<string | null>(null);

  // Parse the input string into an array of numbers
  private parsedData = computed(() => {
    try {
      const numbers = this.data().split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      this.error.set(null);
      return numbers;
    } catch (e) {
      this.error.set('Invalid input data. Please enter comma-separated numbers.');
      return [];
    }
  });

  public onDataChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.data.set(inputElement.value);
  }

  public calculate(): void {
    const data = this.parsedData();
    if (data.length === 0) {
      this.mean.set(null);
      this.median.set(null);
      this.mode.set(null);
      this.error.set('No data to calculate.');
      return;
    }

    this.calculateMean(data);
    this.calculateMedian(data);
    this.calculateMode(data);
  }

  private calculateMean(data: number[]): void {
    const sum = data.reduce((acc, val) => acc + val, 0);
    this.mean.set(sum / data.length);
  }

  private calculateMedian(data: number[]): void {
    const sortedData = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
      this.median.set((sortedData[mid - 1] + sortedData[mid]) / 2);
    } else {
      this.median.set(sortedData[mid]);
    }
  }

  private calculateMode(data: number[]): void {
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

    if (maxCount <= 1 && data.length > 1) {
        this.mode.set(null); // No mode
        return;
    }


    const modes: number[] = [];
    for (const num in counts) {
      if (counts[num] === maxCount) {
        modes.push(parseFloat(num));
      }
    }
    this.mode.set(modes);
  }
}
