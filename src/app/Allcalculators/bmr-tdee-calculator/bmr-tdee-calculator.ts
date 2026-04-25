import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bmr-tdee-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './bmr-tdee-calculator.html',
  styleUrls: ['./bmr-tdee-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BmrTdeeCalculatorComponent {
  gender = signal<'male' | 'female'>('male');
  age = signal<number | null>(null);
  height = signal<number | null>(null);
  weight = signal<number | null>(null);
  activity = signal<number>(1.2);

  bmr = signal<number | null>(null);
  tdee = signal<number | null>(null);
  
  error = signal<string | null>(null);

  calculate() {
    this.error.set(null);
    const a = this.age();
    const h = this.height();
    const w = this.weight();
    const g = this.gender();
    const act = this.activity();

    if (!a || !h || !w) {
      this.error.set('Please fill out all required fields.');
      this.clearResults();
      return;
    }

    if (a <= 0 || h <= 0 || w <= 0) {
      this.error.set('Values must be greater than zero.');
      this.clearResults();
      return;
    }

    // Mifflin-St Jeor Equation
    let bmrResult = (10 * w) + (6.25 * h) - (5 * a);
    if (g === 'male') {
      bmrResult += 5;
    } else {
      bmrResult -= 161;
    }

    const tdeeResult = bmrResult * act;

    this.bmr.set(bmrResult);
    this.tdee.set(tdeeResult);
  }

  private clearResults() {
    this.bmr.set(null);
    this.tdee.set(null);
  }
}
