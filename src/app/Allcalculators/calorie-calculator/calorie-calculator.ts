import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface CalorieResult {
  bmr: number;
  tdee: number;
  macros: {
    protein: { grams: number; calories: number };
    carbs: { grams: number; calories: number };
    fats: { grams: number; calories: number };
  };
}

@Component({
  selector: 'app-calorie-calculator',
  templateUrl: './calorie-calculator.html',
  styleUrls: ['./calorie-calculator.css'],
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalorieCalculatorComponent {
  gender = signal<'male' | 'female'>('male');
  age = signal<number | null>(null);
  weight = signal<number | null>(null);
  height = signal<number | null>(null);
  weightUnit = signal<'kg' | 'lb'>('kg');
  heightUnit = signal<'cm' | 'ft'>('cm');
  activityLevel = signal<number>(1.2);
  formula = signal<'mifflin' | 'harris' | 'katch'>('mifflin');
  bodyFat = signal<number | null>(null);

  result = signal<CalorieResult | null>(null);
  error = signal<string | null>(null);

  ageError = computed(() => {
    const a = this.age();
    if (this.error()) {
      return a === null || isNaN(a) || a <= 0 || a > 120;
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

  heightError = computed(() => {
    const h = this.height();
    if (this.error()) {
      return h === null || isNaN(h) || h <= 0 || h > 300;
    }
    return false;
  });

  bodyFatError = computed(() => {
    const bf = this.bodyFat();
    const f = this.formula();
    if (this.error() && f === 'katch') {
      return bf === null || isNaN(bf) || bf <= 0 || bf > 100;
    }
    return false;
  });

  calculate(): void {
    this.error.set(null);
    const gender = this.gender();
    const age = this.age();
    const weight = this.weight();
    const height = this.height();
    const bf = this.bodyFat();

    if (age === null || isNaN(age)) {
      this.error.set('Validation Error: Please enter a valid number for age.');
      return;
    }

    if (weight === null || isNaN(weight)) {
      this.error.set('Validation Error: Please enter a valid number for weight.');
      return;
    }

    if (height === null || isNaN(height)) {
      this.error.set('Validation Error: Please enter a valid number for height.');
      return;
    }

    if (this.formula() === 'katch' && (bf === null || isNaN(bf))) {
      this.error.set('Validation Error: Please enter a valid number for body fat percentage.');
      return;
    }

    if (age <= 0 || age > 120) {
      this.error.set('Validation Error: Age must be a positive number between 1 and 120.');
      return;
    }

    if (weight <= 0 || weight > 600) {
      this.error.set('Validation Error: Weight must be a positive number between 1 and 600.');
      return;
    }

    if (height <= 0 || height > 300) {
      this.error.set('Validation Error: Height must be a positive number between 1 and 300.');
      return;
    }

    if (this.formula() === 'katch' && (bf! <= 0 || bf! > 100)) {
      this.error.set('Validation Error: Body fat percentage must be between 1% and 100%.');
      return;
    }

    let weightInKg = weight;
    if (this.weightUnit() === 'lb') {
      weightInKg = weight * 0.453592;
    }

    let heightInCm = height;
    if (this.heightUnit() === 'ft') {
      heightInCm = height * 30.48;
    }

    let bmr = 0;
    if (this.formula() === 'mifflin') {
      bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + (gender === 'male' ? 5 : -161);
    } else if (this.formula() === 'harris') {
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age);
      }
    } else if (this.formula() === 'katch' && this.bodyFat()) {
      const lbm = weightInKg * (1 - ((this.bodyFat() ?? 0) / 100));
      bmr = 370 + (21.6 * lbm);
    }

    const tdee = bmr * this.activityLevel();

    const proteinGrams = weightInKg * 1.6;
    const proteinCalories = proteinGrams * 4;
    const fatCalories = tdee * 0.25;
    const fatGrams = fatCalories / 9;
    const carbCalories = tdee - proteinCalories - fatCalories;
    const carbGrams = carbCalories / 4;

    this.result.set({
      bmr,
      tdee,
      macros: {
        protein: { grams: proteinGrams, calories: proteinCalories },
        carbs: { grams: carbGrams, calories: carbCalories },
        fats: { grams: fatGrams, calories: fatCalories },
      },
    });
  }

  recalculate(): void {
    this.result.set(null);
    this.error.set(null);
    this.age.set(null);
    this.weight.set(null);
    this.height.set(null);
    this.bodyFat.set(null);
  }

  toggleWeightUnit(): void {
    this.weightUnit.set(this.weightUnit() === 'kg' ? 'lb' : 'kg');
  }

  toggleHeightUnit(): void {
    this.heightUnit.set(this.heightUnit() === 'cm' ? 'ft' : 'cm');
  }
}
