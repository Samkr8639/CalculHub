import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CalculatorTab = 'equation' | 'polynomial' | 'complex' | 'inequality';

@Component({
  selector: 'app-algebra-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './algebra-calculator.component.html',
  styleUrls: ['./algebra-calculator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlgebraCalculatorComponent {
  activeTab = signal<CalculatorTab>('equation');

  // Equation Solver
  equation = signal('');
  equationResult = signal('');

  // Polynomial Factorer
  polynomial = signal('');
  polynomialResult = signal('');

  // Complex Numbers
  complexNum1 = signal('');
  complexNum2 = signal('');
  complexOperation = signal<'add' | 'subtract' | 'multiply'>('add');
  complexResult = signal('');

  // Inequality Grapher
  inequality = signal('');

  selectTab(tab: CalculatorTab) {
    this.activeTab.set(tab);
  }

  solveEquation() {
    // Placeholder logic
    this.equationResult.set(`Solving: ${this.equation()}... Result: x = 5`);
  }

  factorPolynomial() {
    // Placeholder logic
    this.polynomialResult.set(`Factoring: ${this.polynomial()}... Result: (x-2)(x+3)`);
  }

  calculateComplex() {
    // Placeholder logic
    this.complexResult.set(`Calculating: ${this.complexNum1()} ${this.complexOperation()} ${this.complexNum2()}... Result: 5+3i`);
  }

  graphInequality() {
    // Placeholder logic for graphing
  }
}
