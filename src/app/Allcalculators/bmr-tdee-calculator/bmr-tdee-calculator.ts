import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bmr-tdee-calculator',
  imports: [FormsModule, RouterLink],
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

  ageError = computed(() => {
    const a = this.age();
    if (this.error()) {
      return a === null || isNaN(a) || a <= 0 || a > 120;
    }
    return false;
  });

  heightError = computed(() => {
    const h = this.height();
    if (this.error()) {
      return h === null || isNaN(h) || h <= 0 || h > 300;
    }
    return false;
  });

  weightError = computed(() => {
    const w = this.weight();
    if (this.error()) {
      return w === null || isNaN(w) || w <= 0 || w > 600;
    }
    return false;
  });

  calculate() {
    this.error.set(null);
    const a = this.age();
    const h = this.height();
    const w = this.weight();
    const g = this.gender();
    const act = this.activity();

    if (a === null || isNaN(a)) {
      this.error.set('Validation Error: Please enter a valid number for age.');
      this.clearResults();
      return;
    }

    if (h === null || isNaN(h)) {
      this.error.set('Validation Error: Please enter a valid number for height.');
      this.clearResults();
      return;
    }

    if (w === null || isNaN(w)) {
      this.error.set('Validation Error: Please enter a valid number for weight.');
      this.clearResults();
      return;
    }

    if (a <= 0 || a > 120) {
      this.error.set('Validation Error: Age must be a positive number between 1 and 120.');
      this.clearResults();
      return;
    }

    if (h <= 0 || h > 300) {
      this.error.set('Validation Error: Height must be a positive number between 1 and 300 cm.');
      this.clearResults();
      return;
    }

    if (w <= 0 || w > 600) {
      this.error.set('Validation Error: Weight must be a positive number between 1 and 600 kg.');
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
