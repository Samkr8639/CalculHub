import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-body-fat-calculator',
  imports: [FormsModule, RouterLink],
  templateUrl: './body-fat-calculator.html',
  styleUrls: ['./body-fat-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyFatCalculatorComponent {
  gender = signal<'male' | 'female' | 'other'>('male');
  height = signal<number | null>(null);
  weight = signal<number | null>(null);
  neck = signal<number | null>(null);
  waist = signal<number | null>(null);
  hip = signal<number | null>(null);

  bodyFat = signal<number | null>(null);
  fatMass = signal<number | null>(null);
  leanMass = signal<number | null>(null);
  category = signal<string | null>(null);
  error = signal<string | null>(null);

  categoryClass = computed(() => {
    const cat = this.category();
    if (cat === 'Essential Fat') return 'text-essential';
    if (cat === 'Athletes') return 'text-athletes';
    if (cat === 'Fitness') return 'text-fitness';
    if (cat === 'Average') return 'text-average';
    if (cat === 'Obese') return 'text-obese';
    return '';
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

  neckError = computed(() => {
    const n = this.neck();
    if (this.error()) {
      return n === null || isNaN(n) || n <= 0 || n > 100;
    }
    return false;
  });

  waistError = computed(() => {
    const waist = this.waist();
    if (this.error()) {
      return waist === null || isNaN(waist) || waist <= 0 || waist > 300;
    }
    return false;
  });

  hipError = computed(() => {
    const hip = this.hip();
    const g = this.gender();
    if (this.error() && (g === 'female' || g === 'other')) {
      return hip === null || isNaN(hip) || hip <= 0 || hip > 300;
    }
    return false;
  });

  calculate() {
    this.error.set(null);
    const g = this.gender();
    const h = this.height();
    const w = this.weight();
    const n = this.neck();
    const waist = this.waist();
    const hip = this.hip();

    if (h === null || isNaN(h)) {
      this.error.set('Validation Error: Please enter a valid number for height.');
      this.bodyFat.set(null);
      return;
    }

    if (w === null || isNaN(w)) {
      this.error.set('Validation Error: Please enter a valid number for weight.');
      this.bodyFat.set(null);
      return;
    }

    if (n === null || isNaN(n)) {
      this.error.set('Validation Error: Please enter a valid number for neck circumference.');
      this.bodyFat.set(null);
      return;
    }

    if (waist === null || isNaN(waist)) {
      this.error.set('Validation Error: Please enter a valid number for waist circumference.');
      this.bodyFat.set(null);
      return;
    }

    if ((g === 'female' || g === 'other') && (hip === null || isNaN(hip))) {
      this.error.set('Validation Error: Please enter a valid number for hip circumference.');
      this.bodyFat.set(null);
      return;
    }

    if (h <= 0 || h > 300) {
      this.error.set('Validation Error: Height must be a positive number between 1 and 300 cm.');
      this.bodyFat.set(null);
      return;
    }

    if (w <= 0 || w > 600) {
      this.error.set('Validation Error: Weight must be a positive number between 1 and 600 kg.');
      this.bodyFat.set(null);
      return;
    }

    if (n <= 0 || n > 100) {
      this.error.set('Validation Error: Neck circumference must be a positive number between 1 and 100 cm.');
      this.bodyFat.set(null);
      return;
    }

    if (waist <= 0 || waist > 300) {
      this.error.set('Validation Error: Waist circumference must be a positive number between 1 and 300 cm.');
      this.bodyFat.set(null);
      return;
    }

    if ((g === 'female' || g === 'other') && (hip! <= 0 || hip! > 300)) {
      this.error.set('Validation Error: Hip circumference must be a positive number between 1 and 300 cm.');
      this.bodyFat.set(null);
      return;
    }

    if (g === 'male' && waist <= n) {
      this.error.set('Validation Error: Waist circumference must be greater than neck circumference.');
      this.bodyFat.set(null);
      return;
    }

    if (g === 'other' && waist <= n) {
      this.error.set('Validation Error: Waist circumference must be greater than neck circumference.');
      this.bodyFat.set(null);
      return;
    }

    if ((g === 'female' || g === 'other') && (waist + hip! - n) <= 0) {
      this.error.set('Validation Error: Combined waist and hip must be greater than neck circumference.');
      this.bodyFat.set(null);
      return;
    }

    let bf = 0;
    if (g === 'male') {
      // US Navy method for men: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
      const logPart = 1.0324 - 0.19077 * Math.log10(waist - n) + 0.15456 * Math.log10(h);
      bf = (495 / logPart) - 450;
    } else if (g === 'female') {
      // US Navy method for women: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
      const logPart = 1.29579 - 0.35004 * Math.log10(waist + (hip || 0) - n) + 0.22100 * Math.log10(h);
      bf = (495 / logPart) - 450;
    } else {
      // 'other' -> average of male and female methods
      const logMale = 1.0324 - 0.19077 * Math.log10(waist - n) + 0.15456 * Math.log10(h);
      const bfMale = (495 / logMale) - 450;

      const logFemale = 1.29579 - 0.35004 * Math.log10(waist + (hip || 0) - n) + 0.22100 * Math.log10(h);
      const bfFemale = (495 / logFemale) - 450;

      bf = (bfMale + bfFemale) / 2;
    }

    if (bf < 0 || bf > 100 || isNaN(bf)) {
      this.error.set('Validation Error: The specified measurements yielded an invalid body fat result. Check your inputs.');
      this.bodyFat.set(null);
      return;
    }

    this.bodyFat.set(bf);
    
    // Fat mass & lean mass
    const fMass = (bf / 100) * w;
    this.fatMass.set(fMass);
    this.leanMass.set(w - fMass);

    // ACE categorization
    if (g === 'male') {
      if (bf < 2) this.category.set('Essential Fat');
      else if (bf <= 5) this.category.set('Essential Fat');
      else if (bf <= 13) this.category.set('Athletes');
      else if (bf <= 17) this.category.set('Fitness');
      else if (bf <= 24) this.category.set('Average');
      else this.category.set('Obese');
    } else if (g === 'female') {
      if (bf < 10) this.category.set('Essential Fat');
      else if (bf <= 13) this.category.set('Essential Fat');
      else if (bf <= 20) this.category.set('Athletes');
      else if (bf <= 24) this.category.set('Fitness');
      else if (bf <= 31) this.category.set('Average');
      else this.category.set('Obese');
    } else {
      // 'other' -> average ACE limits
      if (bf < 6) this.category.set('Essential Fat');
      else if (bf <= 10) this.category.set('Essential Fat');
      else if (bf <= 16.5) this.category.set('Athletes');
      else if (bf <= 20.5) this.category.set('Fitness');
      else if (bf <= 27.5) this.category.set('Average');
      else this.category.set('Obese');
    }
  }
}
