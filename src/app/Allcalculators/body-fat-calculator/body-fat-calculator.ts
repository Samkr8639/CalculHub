import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-body-fat-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './body-fat-calculator.html',
  styleUrls: ['./body-fat-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyFatCalculatorComponent {
  gender = signal<'male' | 'female'>('male');
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

  calculate() {
    this.error.set(null);
    const g = this.gender();
    const h = this.height();
    const w = this.weight();
    const n = this.neck();
    const waist = this.waist();
    const hip = this.hip();

    if (!h || !w || !n || !waist || (g === 'female' && !hip)) {
      this.error.set('Please fill out all required fields with positive numbers.');
      this.bodyFat.set(null);
      return;
    }

    if (h <= 0 || w <= 0 || n <= 0 || waist <= 0 || (g === 'female' && (hip || 0) <= 0)) {
      this.error.set('Measurements must be greater than zero.');
      this.bodyFat.set(null);
      return;
    }

    let bf = 0;
    if (g === 'male') {
      // US Navy method for men: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
      const logPart = 1.0324 - 0.19077 * Math.log10(waist - n) + 0.15456 * Math.log10(h);
      bf = (495 / logPart) - 450;
    } else {
      // US Navy method for women: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
      const logPart = 1.29579 - 0.35004 * Math.log10(waist + (hip || 0) - n) + 0.22100 * Math.log10(h);
      bf = (495 / logPart) - 450;
    }

    if (bf < 0 || bf > 100 || isNaN(bf)) {
      this.error.set('The specified measurements yielded an invalid result. Check your inputs.');
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
    } else {
      if (bf < 10) this.category.set('Essential Fat');
      else if (bf <= 13) this.category.set('Essential Fat');
      else if (bf <= 20) this.category.set('Athletes');
      else if (bf <= 24) this.category.set('Fitness');
      else if (bf <= 31) this.category.set('Average');
      else this.category.set('Obese');
    }
  }
}
