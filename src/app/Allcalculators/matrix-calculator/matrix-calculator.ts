import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type Matrix = number[][];
type Operation = 'add' | 'subtract' | 'multiply' | 'scalar-multiply' | 'transpose' | 'determinant' | 'inverse';

@Component({
  selector: 'app-matrix-calculator',
  imports: [FormsModule, CommonModule],
  templateUrl: './matrix-calculator.html',
  styleUrls: ['./matrix-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatrixCalculatorComponent {
  public matrixA = signal('');
  public matrixB = signal('');
  public operation = signal<Operation>('add');
  public scalar = signal(1);
  public result = signal<Matrix | number | null>(null);
  public error = signal<string | null>(null);

  public matrixResult = computed(() => {
    const res = this.result();
    return this.isMatrix(res) ? res : null;
  });

  public scalarResult = computed(() => {
    const res = this.result();
    return typeof res === 'number' ? res : null;
  });

  public operations = [
    { id: 'add', name: 'Addition' },
    { id: 'subtract', name: 'Subtraction' },
    { id: 'multiply', name: 'Multiplication' },
    { id: 'scalar-multiply', name: 'Scalar Multiplication' },
    { id: 'transpose', name: 'Transpose' },
    { id: 'determinant', name: 'Determinant' },
    { id: 'inverse', name: 'Inverse' },
  ];

  public operationRequiresTwoMatrices = computed(() => {
    const op = this.operation();
    return op === 'add' || op === 'subtract' || op === 'multiply';
  });

  public isScalarMultiplication = computed(() => this.operation() === 'scalar-multiply');

  public isMatrix(value: any): value is Matrix {
    return Array.isArray(value) && value.every(row => Array.isArray(row));
  }

  public onOperationChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.operation.set(selectElement.value as Operation);
  }

  public onMatrixAChange(event: Event): void {
    const textAreaElement = event.target as HTMLTextAreaElement;
    this.matrixA.set(textAreaElement.value);
  }

  public onMatrixBChange(event: Event): void {
    const textAreaElement = event.target as HTMLTextAreaElement;
    this.matrixB.set(textAreaElement.value);
  }

  public onScalarChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.scalar.set(parseFloat(inputElement.value) || 0);
  }

  private parseMatrix(matrixStr: string): Matrix {
    if (!matrixStr.trim()) return [];
    return matrixStr.trim().split(/[,;\n]/).map(row =>
      row.trim().split(/[,\s]+/).map(val => {
        const num = parseFloat(val);
        if (isNaN(num)) {
          throw new Error(`Invalid number '${val}' in matrix.`);
        }
        return num;
      })
    );
  }

  public calculate() {
    this.result.set(null);
    this.error.set(null);

    try {
      const matrixA = this.parseMatrix(this.matrixA());
      const matrixB = this.operationRequiresTwoMatrices() ? this.parseMatrix(this.matrixB()) : null;

      if (!this.isValidMatrix(matrixA)) throw new Error('Matrix A has inconsistent columns.');
      if (matrixB && !this.isValidMatrix(matrixB)) throw new Error('Matrix B has inconsistent columns.');

      switch (this.operation()) {
        case 'add':
          this.result.set(this.add(matrixA, matrixB!));
          break;
        case 'subtract':
          this.result.set(this.subtract(matrixA, matrixB!));
          break;
        case 'multiply':
          this.result.set(this.multiply(matrixA, matrixB!));
          break;
        case 'scalar-multiply':
          this.result.set(this.scalarMultiply(matrixA, this.scalar()));
          break;
        case 'transpose':
          this.result.set(this.transpose(matrixA));
          break;
        case 'determinant':
          this.result.set(this.determinant(matrixA));
          break;
        case 'inverse':
          this.result.set(this.inverse(matrixA));
          break;
      }
    } catch (e: any) {
      this.error.set(e.message);
    }
  }

  public clear(): void {
    this.matrixA.set('');
    this.matrixB.set('');
    this.scalar.set(1);
    this.result.set(null);
    this.error.set(null);
  }

  private isValidMatrix(matrix: Matrix): boolean {
    if (!matrix || matrix.length === 0) return true;
    const firstRowLength = matrix[0]?.length ?? 0;
    return matrix.every(row => row.length === firstRowLength);
  }

  private add(a: Matrix, b: Matrix): Matrix {
    if (a.length !== b.length || a[0]?.length !== b[0]?.length) {
      throw new Error('Matrices must have the same dimensions for addition.');
    }
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  }

  private subtract(a: Matrix, b: Matrix): Matrix {
    if (a.length !== b.length || a[0]?.length !== b[0]?.length) {
      throw new Error('Matrices must have the same dimensions for subtraction.');
    }
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
  }

  private multiply(a: Matrix, b: Matrix): Matrix {
    if (a[0]?.length !== b.length) {
      throw new Error('Columns in Matrix A must equal rows in Matrix B.');
    }
    const result: Matrix = Array(a.length).fill(0).map(() => Array(b[0]?.length || 0).fill(0));
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < (b[0]?.length || 0); j++) {
        for (let k = 0; k < (a[0]?.length || 0); k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  }

  private scalarMultiply(a: Matrix, scalar: number): Matrix {
    return a.map(row => row.map(val => val * scalar));
  }

  private transpose(a: Matrix): Matrix {
    if (a.length === 0) return [];
    const result: Matrix = Array(a[0].length).fill(0).map(() => Array(a.length).fill(0));
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a[0].length; j++) {
        result[j][i] = a[i][j];
      }
    }
    return result;
  }

  private determinant(a: Matrix): number {
    if (a.length === 0) return 1;
    if (a.length !== a[0]?.length) {
      throw new Error('Matrix must be square to calculate the determinant.');
    }
    const n = a.length;
    if (n === 1) return a[0][0];
    if (n === 2) return a[0][0] * a[1][1] - a[0][1] * a[1][0];

    let det = 0;
    for (let j = 0; j < n; j++) {
      det += a[0][j] * this.cofactor(a, 0, j);
    }
    return det;
  }

  private inverse(a: Matrix): Matrix {
    if (a.length !== a[0]?.length) {
      throw new Error('Matrix must be square to calculate the inverse.');
    }
    const det = this.determinant(a);
    if (det === 0) {
      throw new Error('Matrix is singular and has no inverse.');
    }

    const n = a.length;
    if (n === 1) return [[1 / a[0][0]]];

    const adjugate: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        adjugate[j][i] = this.cofactor(a, i, j);
      }
    }

    return this.scalarMultiply(adjugate, 1 / det);
  }

  private cofactor(a: Matrix, row: number, col: number): number {
    return Math.pow(-1, row + col) * this.determinant(this.minor(a, row, col));
  }

  private minor(a: Matrix, row: number, col: number): Matrix {
    return a.filter((_, i) => i !== row).map(r => r.filter((_, j) => j !== col));
  }
}
