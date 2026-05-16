import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import * as math from 'mathjs';

@Component({
  selector: 'app-scientific-calculator',
  imports: [],
  templateUrl: './scientific-calculator.html',
  styleUrls: ['./scientific-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScientificCalculatorComponent {
  display = signal('0');
  isSecondFunction = signal(false);
  isRadianMode = signal(true);
  memory = signal(0);

  get isError(): boolean {
    return this.display() === 'Error';
  }

  private get lastChar(): string {
    return this.display().slice(-1);
  }

  private get isOperator() {
    return ['+', '-', '*', '/'].includes(this.lastChar);
  }

  appendNumber(num: string): void {
    if (this.isError) this.clear();

    if (this.display() === '0' || this.display() === '-0') {
      if (num === '0') return;
      this.display.set(this.display().slice(0, -1) + num);
    } else {
      this.display.update(d => d + num);
    }
  }

  appendDecimal(): void {
    if (this.isError) return;

    const segments = this.display().split(/[+\-*\/]/);
    if (!segments[segments.length - 1].includes('.')) {
      this.display.update(d => d + '.');
    }
  }

  appendOperator(op: string): void {
    if (this.isError) return;

    if (this.isOperator) {
      // Replace the last operator if needed
      this.display.update(d => d.slice(0, -1) + op);
    } else {
      this.display.update(d => d + op);
    }
  }

  calculate(): void {
    if (this.isError || this.isOperator) return;

    try {
      const result = math.evaluate(this.display());
      if (typeof result !== 'number' || Number.isNaN(result) || !Number.isFinite(result)) {
        this.display.set('Error');
      } else {
        this.display.set(String(result));
      }
    } catch (e) {
      this.display.set('Error');
    }
  }

  clear(): void {
    this.display.set('0');
  }

  backspace(): void {
    if (this.isError) {
      this.clear();
      return;
    }
    if (this.display().length > 1) {
      this.display.update(d => d.slice(0, -1));
    } else {
      this.display.set('0');
    }
  }

  toggleSign(): void {
    if (this.isError) return;

    this.display.update(d => {
      if (d.startsWith('-')) {
        return d.substring(1);
      } else {
        return '-' + d;
      }
    });
  }

  toggleSecondFunction(): void {
    this.isSecondFunction.update(v => !v);
  }

  toggleAngleMode(): void {
    this.isRadianMode.update(v => !v);
  }

  performScientificFunction(func: string): void {
    if (this.isError) return;

    this.calculate();
    let value = parseFloat(this.display());
    if (Number.isNaN(value)) {
      this.display.set('Error');
      return;
    }

    let result: number | string;

    if (!this.isRadianMode() && ['sin', 'cos', 'tan'].includes(func)) {
      value = (value * Math.PI) / 180;
    }

    switch (func) {
      case 'sin': result = this.isSecondFunction() ? Math.asin(value) : Math.sin(value); break;
      case 'cos': result = this.isSecondFunction() ? Math.acos(value) : Math.cos(value); break;
      case 'tan': result = this.isSecondFunction() ? Math.atan(value) : Math.tan(value); break;
      case 'log': result = this.isSecondFunction() ? Math.pow(10, value) : Math.log10(value); break;
      case 'ln': result = this.isSecondFunction() ? Math.exp(value) : Math.log(value); break;
      case 'sqrt': result = Math.sqrt(value); break;
      case 'sqr': result = Math.pow(value, 2); break;
      case 'inv': result = 1 / value; break;
      case 'abs': result = Math.abs(value); break;
      case 'pi': this.display.set(String(Math.PI)); return;
      case 'e': this.display.set(String(Math.E)); return;
      case 'fact': result = this.factorial(value); break;
      default: result = 'Error';
    }

    if (Number.isNaN(result) || !Number.isFinite(result)) {
      this.display.set('Error');
    } else {
      this.display.set(String(result));
    }
  }

  memoryClear(): void {
    this.memory.set(0);
  }

  memoryRecall(): void {
    this.display.set(String(this.memory()));
  }

  memoryAdd(): void {
    this.calculate();
    this.memory.update(m => m + parseFloat(this.display()));
  }

  memorySubtract(): void {
    this.calculate();
    this.memory.update(m => m - parseFloat(this.display()));
  }

  private factorial(n: number): number {
    if (n < 0 || n % 1 !== 0) return NaN; // Factorial is not defined for negative numbers or non-integers
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }
}
