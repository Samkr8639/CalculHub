import { Component, signal } from '@angular/core';
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
  imports: [FormsModule, CommonModule]
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

  calculate(): void {
    const gender = this.gender();
    const age = this.age();
    let weightInKg = this.weight();
    let heightInCm = this.height();

    if (this.weightUnit() === 'lb') {
      weightInKg = (this.weight() ?? 0) * 0.453592;
    }

    if (this.heightUnit() === 'ft') {
      heightInCm = (this.height() ?? 0) * 30.48;
    }

    if (!age || !weightInKg || !heightInCm) {
      return;
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
