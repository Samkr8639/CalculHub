import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics-calculator',
  imports: [FormsModule, CommonModule],
  templateUrl: './statistics-calculator.html',
  styleUrls: ['./statistics-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsCalculator {
  public data = signal('');

  public dataset = computed(() => {
    return this.data()
      .split(',')
      .map((value) => parseFloat(value.trim()))
      .filter((value) => !isNaN(value))
      .sort((a, b) => a - b);
  });

  public mean = computed(() => {
    const data = this.dataset();
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, value) => acc + value, 0);
    return sum / data.length;
  });

  public median = computed(() => {
    const data = this.dataset();
    if (data.length === 0) return 0;
    const mid = Math.floor(data.length / 2);
    if (data.length % 2 === 0) {
      return (data[mid - 1] + data[mid]) / 2;
    } else {
      return data[mid];
    }
  });

  public mode = computed(() => {
    const data = this.dataset();
    if (data.length === 0) return 0;
    const frequencyMap: { [key: number]: number } = {};
    data.forEach((value) => {
      frequencyMap[value] = (frequencyMap[value] || 0) + 1;
    });
    let maxFrequency = 0;
    let modes: number[] = [];
    for (const value in frequencyMap) {
      if (frequencyMap[value] > maxFrequency) {
        maxFrequency = frequencyMap[value];
        modes = [parseFloat(value)];
      } else if (frequencyMap[value] === maxFrequency) {
        modes.push(parseFloat(value));
      }
    }
    if (modes.length === data.length) return 0; // No mode
    return modes.join(', ');
  });

  public results = computed(() => ({
    mean: this.mean(),
    median: this.median(),
    mode: this.mode(),
  }));
}
