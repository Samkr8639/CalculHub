import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-percentage-calculator',
  imports: [CommonModule],
  templateUrl: './percentage-calculator.html',
  styleUrls: ['./percentage-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PercentageCalculatorComponent {
  // What is X% of Y?
  percentage1 = signal<number | null>(15);
  value1 = signal<number | null>(750);
  result1 = computed(() => {
    const p = this.percentage1();
    const v = this.value1();
    return (p !== null && v !== null) ? (v * p) / 100 : null;
  });

  // X is what % of Y?
  value2X = signal<number | null>(112.5);
  value2Y = signal<number | null>(750);
  result2 = computed(() => {
    const x = this.value2X();
    const y = this.value2Y();
    return (x !== null && y !== null && y !== 0) ? (x / y) * 100 : null;
  });

  // What is the % increase/decrease from X to Y?
  value3X = signal<number | null>(600);
  value3Y = signal<number | null>(750);
  result3 = computed(() => {
    const x = this.value3X();
    const y = this.value3Y();
    if (x !== null && y !== null && x !== 0) {
      const diff = y - x;
      return (diff / x) * 100;
    } else {
      return null;
    }
  });

  onInput(event: Event, signalSetter: (value: number | null) => void) {
    const value = (event.target as HTMLInputElement).value;
    signalSetter(parseFloat(value) || null);
  }
}
