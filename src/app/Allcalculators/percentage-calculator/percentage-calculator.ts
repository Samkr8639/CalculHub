import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-percentage-calculator',
  imports: [CommonModule, RouterLink],
  templateUrl: './percentage-calculator.html',
  styleUrls: ['./percentage-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PercentageCalculatorComponent {
  // What is X% of Y?
  percentage1 = signal<number | null>(15);
  value1 = signal<number | null>(750);
  result1 = signal<number | null>(112.5);
  error1 = signal<string | null>(null);

  // X is what % of Y?
  value2X = signal<number | null>(112.5);
  value2Y = signal<number | null>(750);
  result2 = signal<number | null>(15);
  error2 = signal<string | null>(null);

  // What is the % increase/decrease from X to Y?
  value3X = signal<number | null>(600);
  value3Y = signal<number | null>(750);
  result3 = signal<number | null>(25);
  error3 = signal<string | null>(null);

  calculateSection1() {
    this.error1.set(null);
    const p = this.percentage1();
    const v = this.value1();

    if (p === null || isNaN(p)) {
      this.error1.set('Please enter a valid percentage.');
      this.result1.set(null);
      return;
    }
    if (v === null || isNaN(v)) {
      this.error1.set('Please enter a valid value.');
      this.result1.set(null);
      return;
    }
    this.result1.set((v * p) / 100);
  }

  calculateSection2() {
    this.error2.set(null);
    const x = this.value2X();
    const y = this.value2Y();

    if (x === null || isNaN(x)) {
      this.error2.set('Please enter a valid value for X.');
      this.result2.set(null);
      return;
    }
    if (y === null || isNaN(y)) {
      this.error2.set('Please enter a valid value for Y.');
      this.result2.set(null);
      return;
    }
    if (y === 0) {
      this.error2.set('Y cannot be zero to avoid division by zero.');
      this.result2.set(null);
      return;
    }
    this.result2.set((x / y) * 100);
  }

  calculateSection3() {
    this.error3.set(null);
    const x = this.value3X();
    const y = this.value3Y();

    if (x === null || isNaN(x)) {
      this.error3.set('Please enter a valid starting value.');
      this.result3.set(null);
      return;
    }
    if (y === null || isNaN(y)) {
      this.error3.set('Please enter a valid ending value.');
      this.result3.set(null);
      return;
    }
    if (x === 0) {
      this.error3.set('Starting value cannot be zero.');
      this.result3.set(null);
      return;
    }
    const diff = y - x;
    this.result3.set((diff / x) * 100);
  }

  onInput(event: Event, signalSetter: (value: number | null) => void) {
    const value = (event.target as HTMLInputElement).value;
    const parsed = parseFloat(value);
    signalSetter(!isNaN(parsed) ? parsed : null);
  }
}
