import { ChangeDetectionStrategy, Component, signal, ViewChild, ElementRef, AfterViewInit, WritableSignal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import * as math from 'mathjs';

type CalculatorTab = 'equation' | 'polynomial' | 'complex' | 'inequality';

interface Inequality {
  id: number;
  value: string;
  color: string;
}

@Component({
  selector: 'app-algebra-calculator',
  imports: [FormsModule],
  templateUrl: './algebra-calculator.component.html',
  styleUrls: ['./algebra-calculator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlgebraCalculatorComponent implements AfterViewInit {
  activeTab = signal<CalculatorTab>('inequality');

  // Equation Solver
  equation = signal('2x + 4 = 10');
  equationResult = signal('');
  equationSteps = signal<string[]>([]);

  // Polynomial Factorer
  polynomial = signal('x^2 - 5x + 6');
  polynomialResult = signal('');
  polynomialSteps = signal<string[]>([]);

  // Complex Numbers
  complexNum1 = signal('3 + 2i');
  complexNum2 = signal('1 - 4i');
  complexOperation = signal<'add' | 'subtract' | 'multiply'>('add');
  complexResult = signal('');

  // Inequality Grapher
  inequalities: WritableSignal<Inequality[]> = signal([
    { id: 1, value: 'x^2 + y^2 < 16', color: 'rgba(225, 25, 49, 0.5)' },
    { id: 2, value: 'y > x', color: 'rgba(25, 118, 210, 0.5)' }
  ]);
  private nextId = 3;
  private readonly colors = ['rgba(225, 25, 49, 0.5)', 'rgba(25, 118, 210, 0.5)', 'rgba(76, 175, 80, 0.5)', 'rgba(255, 193, 7, 0.5)', 'rgba(156, 39, 176, 0.5)'];

  @ViewChild('inequalityCanvas') private canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    if (this.activeTab() === 'inequality') {
      this.initCanvasAndGraph();
    }
  }

  selectTab(tab: CalculatorTab) {
    this.activeTab.set(tab);
    if (tab === 'inequality') {
      this.initCanvasAndGraph();
    }
  }

  initCanvasAndGraph() {
    setTimeout(() => {
      if (!this.canvas) return;
      const context = this.canvas.nativeElement.getContext('2d');
      if (!context) return;
      this.ctx = context;
      this.graphAllInequalities();
    }, 0);
  }

  addInequality() {
    const newColor = this.colors[(this.nextId - 1) % this.colors.length];
    this.inequalities.update(ineqs => [...ineqs, { id: this.nextId++, value: '', color: newColor }]);
  }

  removeInequality(id: number) {
    this.inequalities.update(ineqs => ineqs.filter(ineq => ineq.id !== id));
    this.graphAllInequalities();
  }

  graphAllInequalities() {
    if (!this.ctx) {
        this.initCanvasAndGraph();
        return;
    }
    this.drawGrid();

    const allIneqs = this.inequalities();
    for (const ineq of allIneqs) {
      this.graphSingleInequality(ineq);
    }
  }

  graphSingleInequality(ineq: Inequality) {
    const inequalityStr = ineq.value;
    const parts = inequalityStr.match(/(.+)(>=|<=|>|<)(.+)/);
    if (!parts || parts.length !== 4) return;

    const lhsStr = parts[1].trim();
    const operator = parts[2].trim();
    const rhsStr = parts[3].trim();

    try {
      const lhsNode = math.parse(lhsStr);
      const rhsNode = math.parse(rhsStr);
      const { width, height } = this.canvas.nativeElement;
      const scale = 20;
      const originX = width / 2;
      const originY = height / 2;

      const imageData = this.ctx.getImageData(0, 0, width, height);
      const color = this.parseRgba(ineq.color);

      for (let px = 0; px < width; px++) {
        for (let py = 0; py < height; py++) {
          const x = (px - originX) / scale;
          const y = (originY - py) / scale;
          const scope = { x, y };
          
          let lhsValue, rhsValue;
          try {
            lhsValue = lhsNode.evaluate(scope);
            rhsValue = rhsNode.evaluate(scope);
          } catch (e: unknown) { continue; } // Skip points where evaluation fails

          let isTrue = false;
          switch (operator) {
            case '<': isTrue = lhsValue < rhsValue; break;
            case '<=': isTrue = lhsValue <= rhsValue; break;
            case '>': isTrue = lhsValue > rhsValue; break;
            case '>=': isTrue = lhsValue >= rhsValue; break;
          }

          if (isTrue) {
            const index = (py * width + px) * 4;
            // Blend colors if the pixel is already colored
            if (imageData.data[index + 3] > 0) {
              imageData.data[index] = (imageData.data[index] + color.r) / 2;
              imageData.data[index + 1] = (imageData.data[index + 1] + color.g) / 2;
              imageData.data[index + 2] = (imageData.data[index + 2] + color.b) / 2;
              imageData.data[index + 3] = Math.min(255, imageData.data[index + 3] + color.a * 255);
            } else {
              imageData.data[index] = color.r;
              imageData.data[index + 1] = color.g;
              imageData.data[index + 2] = color.b;
              imageData.data[index + 3] = color.a * 255;
            }
          }
        }
      }
      this.ctx.putImageData(imageData, 0, 0);

      // Draw boundary line
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      this.ctx.setLineDash((operator === '<' || operator === '>') ? [8, 8] : []);

      this.ctx.beginPath();
      const boundaryNode = math.parse(`${lhsStr} - (${rhsStr})`);
      for (let px = 0; px < width; px++) {
        const x = (px - originX) / scale;
        for (let py = 0; py < height; py++) {
          const y = (originY - py) / scale;
          const prevY = (originY - (py - 1)) / scale;
          try {
            const val = boundaryNode.evaluate({ x, y });
            const prevVal = boundaryNode.evaluate({ x, y: prevY });
            if (val * prevVal < 0) { // Sign change indicates crossing boundary
              this.ctx.rect(px, py, 1, 1);
            }
          } catch (e: unknown) { }
        }
      }
      this.ctx.stroke();
      this.ctx.setLineDash([]);

    } catch (error: unknown) {
      console.error(`Graphing error for "${ineq.value}":`, error);
    }
  }

  parseRgba(rgba: string): { r: number, g: number, b: number, a: number } {
    const result = rgba.match(/(\d+)/g);
    if (result && result.length >= 3) {
      return {
        r: parseInt(result[0]),
        g: parseInt(result[1]),
        b: parseInt(result[2]),
        a: result.length > 3 ? parseFloat(result[3]) : 0.5,
      };
    }
    return { r: 255, g: 0, b: 0, a: 0.5 }; // Default color
  }

  // ... other methods (solveEquation, factorPolynomial, calculateComplex, drawGrid) are unchanged ...
   drawGrid() {
    const { width, height } = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, width, height);
    const scale = 20;
    const originX = width / 2;
    const originY = height / 2;

    // Set background
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;
    for (let i = scale; i < width / 2; i += scale) {
      this.ctx.beginPath();
      this.ctx.moveTo(originX + i, 0);
      this.ctx.lineTo(originX + i, height);
      this.ctx.moveTo(originX - i, 0);
      this.ctx.lineTo(originX - i, height);
      this.ctx.stroke();
    }
    for (let i = scale; i < height / 2; i += scale) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, originY + i);
      this.ctx.lineTo(width, originY + i);
      this.ctx.moveTo(0, originY - i);
      this.ctx.lineTo(width, originY - i);
      this.ctx.stroke();
    }

    // Draw axes
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(originX, 0);
    this.ctx.lineTo(originX, height);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(0, originY);
    this.ctx.lineTo(width, originY);
    this.ctx.stroke();
  }

  solveEquation() {
    this.equationResult.set('');
    this.equationSteps.set([]);
    const eq = this.equation().trim();

    if (!eq) {
      this.equationResult.set('Please enter a linear equation.');
      return;
    }

    try {
      const steps: string[] = [];
      const sides = eq.split('=');
      if (sides.length !== 2) throw new Error('Invalid equation format.');

      const left = sides[0].trim();
      const right = sides[1].trim();
      
      const getCoefficients = (expr: string): { a: number, b: number } => {
        const node = math.parse(expr);
        const b = node.evaluate({ x: 0 });
        const a = node.evaluate({ x: 1 }) - b;
        return { a, b };
      };

      const leftCoeffs = getCoefficients(left);
      const rightCoeffs = getCoefficients(right);

      const a = leftCoeffs.a;
      const b = leftCoeffs.b;
      const c = rightCoeffs.a;
      const d = rightCoeffs.b;
      const format = (n: number) => math.format(n, { notation: 'fixed', precision: 4 }).replace(/\.?0+$/, '');

      steps.push(`Start with the equation: ${eq}`);
      
      const a_minus_c = a - c;
      steps.push(`Move all terms with 'x' to the left and constants to the right: ${format(a)}x - ${format(c)}x = ${format(d)} - ${format(b)}`);
      
      const d_minus_b = d - b;
      steps.push(`Simplify both sides: ${format(a_minus_c)}x = ${format(d_minus_b)}`);

      if (math.abs(a_minus_c) < 1e-12) {
        if (math.abs(d_minus_b) < 1e-12) {
          this.equationResult.set('Infinite solutions');
          steps.push('The equation simplifies to 0 = 0, which is always true.');
        } else {
          this.equationResult.set('No solution');
          steps.push(`The equation simplifies to 0 = ${format(d_minus_b)}, a contradiction.`);
        }
      } else {
        const solution = d_minus_b / a_minus_c;
        steps.push(`Isolate x by dividing by ${format(a_minus_c)}: x = ${format(d_minus_b)} / ${format(a_minus_c)}`);
        const finalResult = `x = ${math.format(solution, { fraction: 'ratio' })}`;
        steps.push(`The final answer is ${finalResult}.`);
        this.equationResult.set(`Solution: ${finalResult}`);
      }

      this.equationSteps.set(steps);
    } catch (error: unknown) {
      this.equationResult.set('Could not solve. Please check the equation format.');
      console.error('Equation solving error:', error);
    }
  }

  factorPolynomial() {
    this.polynomialResult.set('');
    this.polynomialSteps.set([]);
    const poly = this.polynomial().trim();
    if (!poly) {
      this.polynomialResult.set('Please enter a quadratic polynomial.');
      return;
    }

    const steps: string[] = [];

    try {
      const node = math.parse(poly);
      const p0 = node.evaluate({ x: 0 });
      const p1 = node.evaluate({ x: 1 });
      const p_minus_1 = node.evaluate({ x: -1 });

      const c = p0;
      const a = (p1 + p_minus_1 - 2 * c) / 2;
      const b = (p1 - p_minus_1) / 2;
      
      steps.push(`Starting with the polynomial: ${poly}`);
      steps.push(`Identified coefficients: a = ${a}, b = ${b}, c = ${c}`);

      const discriminant = b * b - 4 * a * c;
      steps.push(`Calculate discriminant (Δ = b² - 4ac): Δ = ${b}² - 4 * ${a} * ${c} = ${discriminant}`);

      if (discriminant < 0) {
        this.polynomialResult.set('No real factors (complex roots).');
        steps.push('Discriminant is negative, so there are no real roots.');
        this.polynomialSteps.set(steps);
        return;
      }

      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      steps.push(`Use the quadratic formula to find roots: x = (-b ± √Δ) / 2a`);
      steps.push(`The roots are r1 = ${root1} and r2 = ${root2}`);

      const formatSign = (n: number) => (n < 0 ? `+ ${-n}` : `- ${n}`);
      const factor1 = `(x ${formatSign(root1)})`;
      const factor2 = `(x ${formatSign(root2)})`;
      const finalResult = a === 1 ? `${factor1}${factor2}` : `${a}${factor1}${factor2}`;

      this.polynomialResult.set(`Factored form: ${finalResult}`);
      steps.push(`Construct the factored form a(x - r1)(x - r2): ${finalResult}`);
      this.polynomialSteps.set(steps);

    } catch (error: unknown) {
      this.polynomialResult.set('Could not factor. Use format like "ax^2 + bx + c".');
      console.error('Factoring error:', error);
    }
  }

  calculateComplex() {
    const num1 = this.complexNum1();
    const num2 = this.complexNum2();
    if (!num1 || !num2) {
      this.complexResult.set('Please enter both complex numbers.');
      return;
    }
    try {
      const c1 = math.complex(num1);
      const c2 = math.complex(num2);
      let result;
      switch (this.complexOperation()) {
        case 'add': result = math.add(c1, c2); break;
        case 'subtract': result = math.subtract(c1, c2); break;
        case 'multiply': result = math.multiply(c1, c2); break;
        default: throw new Error('Unsupported operation');
      }
      this.complexResult.set(`Result: ${result.toString()}`);
    } catch (error: unknown) {
      this.complexResult.set('Invalid complex number format. Use "a + bi".');
      console.error('Complex calc error:', error);
    }
  }
}
