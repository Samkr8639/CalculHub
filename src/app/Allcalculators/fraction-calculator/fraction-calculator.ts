import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type FractionOp = '+' | '-' | '×' | '÷';

@Component({
  selector: 'app-fraction-calculator',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './fraction-calculator.html',
  styleUrls: ['./fraction-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FractionCalculatorComponent {
  num1 = signal<number>(3);
  den1 = signal<number>(4);
  operation = signal<FractionOp>('+');
  num2 = signal<number>(1);
  den2 = signal<number>(3);

  operations: FractionOp[] = ['+', '-', '×', '÷'];

  result = computed(() => {
    const n1 = this.num1(), d1 = this.den1(), n2 = this.num2(), d2 = this.den2();
    if (d1 === 0 || d2 === 0) return null;
    let rn: number, rd: number;
    switch (this.operation()) {
      case '+': rn = n1 * d2 + n2 * d1; rd = d1 * d2; break;
      case '-': rn = n1 * d2 - n2 * d1; rd = d1 * d2; break;
      case '×': rn = n1 * n2; rd = d1 * d2; break;
      case '÷':
        if (n2 === 0) return null;
        rn = n1 * d2; rd = d1 * n2; break;
    }
    const g = this.gcd(Math.abs(rn), Math.abs(rd));
    const simplN = rn / g;
    const simplD = rd / g;
    // Normalise sign: denominator always positive
    const sign = simplD < 0 ? -1 : 1;
    return { num: simplN * sign, den: simplD * sign, decimal: simplN * sign / (simplD * sign) };
  });

  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  wholeNumber = computed(() => {
    const r = this.result();
    if (!r) return null;
    if (r.den === 1) return r.num;
    if (Math.abs(r.num) > Math.abs(r.den)) return Math.trunc(r.num / r.den);
    return null;
  });

  mixedRemainder = computed(() => {
    const r = this.result();
    if (!r || Math.abs(r.num) <= Math.abs(r.den)) return null;
    return { num: r.num % r.den, den: r.den };
  });

  onOpChange(event: Event) {
    this.operation.set((event.target as HTMLSelectElement).value as FractionOp);
  }
}
