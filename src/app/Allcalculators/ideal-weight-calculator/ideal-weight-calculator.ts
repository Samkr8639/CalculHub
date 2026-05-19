import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ideal-weight-calculator',
  imports: [FormsModule],
  templateUrl: './ideal-weight-calculator.html',
  styleUrls: ['./ideal-weight-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdealWeightCalculatorComponent {
  gender = signal<'male' | 'female' | 'other'>('male');
  height = signal<number | null>(null);

  idealWeightRobinson = signal<number | null>(null);
  idealWeightMiller = signal<number | null>(null);
  idealWeightDevine = signal<number | null>(null);
  idealWeightHamwi = signal<number | null>(null);
  
  healthyRangeMin = signal<number | null>(null);
  healthyRangeMax = signal<number | null>(null);
  
  error = signal<string | null>(null);

  heightError = computed(() => {
    const h = this.height();
    if (this.error()) {
      return h === null || isNaN(h) || h < 152.4 || h > 300;
    }
    return false;
  });

  calculate() {
    this.error.set(null);
    const h = this.height();
    const g = this.gender();

    if (h === null || isNaN(h)) {
      this.error.set('Validation Error: Please enter a valid number for height.');
      this.clearResults();
      return;
    }

    if (h < 152.4 || h > 300) {
      this.error.set('Validation Error: Height must be between 152.4 cm (5 feet) and 300 cm.');
      this.clearResults();
      return;
    }

    const inchesOver5Feet = (h - 152.4) / 2.54;

    let robinson, miller, devine, hamwi;

    if (g === 'male') {
      robinson = 52 + 1.9 * inchesOver5Feet;
      miller = 56.2 + 1.41 * inchesOver5Feet;
      devine = 50 + 2.3 * inchesOver5Feet;
      hamwi = 48 + 2.7 * inchesOver5Feet;
    } else if (g === 'female') {
      robinson = 49 + 1.7 * inchesOver5Feet;
      miller = 53.1 + 1.36 * inchesOver5Feet;
      devine = 45.5 + 2.3 * inchesOver5Feet;
      hamwi = 45.5 + 2.2 * inchesOver5Feet;
    } else {
      // 'other' -> average of male and female formulas
      robinson = ((52 + 1.9 * inchesOver5Feet) + (49 + 1.7 * inchesOver5Feet)) / 2;
      miller = ((56.2 + 1.41 * inchesOver5Feet) + (53.1 + 1.36 * inchesOver5Feet)) / 2;
      devine = ((50 + 2.3 * inchesOver5Feet) + (45.5 + 2.3 * inchesOver5Feet)) / 2;
      hamwi = ((48 + 2.7 * inchesOver5Feet) + (45.5 + 2.2 * inchesOver5Feet)) / 2;
    }

    this.idealWeightRobinson.set(robinson);
    this.idealWeightMiller.set(miller);
    this.idealWeightDevine.set(devine);
    this.idealWeightHamwi.set(hamwi);

    // Healthy BMI Range (18.5 - 24.9)
    const heightInMeters = h / 100;
    const heightSquared = heightInMeters * heightInMeters;
    this.healthyRangeMin.set(18.5 * heightSquared);
    this.healthyRangeMax.set(24.9 * heightSquared);
  }

  private clearResults() {
    this.idealWeightRobinson.set(null);
    this.idealWeightMiller.set(null);
    this.idealWeightDevine.set(null);
    this.idealWeightHamwi.set(null);
    this.healthyRangeMin.set(null);
    this.healthyRangeMax.set(null);
  }
}
