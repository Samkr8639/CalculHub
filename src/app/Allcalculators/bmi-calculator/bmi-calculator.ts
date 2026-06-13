import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmbedWidgetComponent } from '../../embed-widget/embed-widget.component';

@Component({
  selector: 'app-bmi-calculator',
  imports: [FormsModule, EmbedWidgetComponent],
  templateUrl: './bmi-calculator.html',
  styleUrls: ['./bmi-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BmiCalculatorComponent {
  height = signal<number | null>(null);
  weight = signal<number | null>(null);
  
  bmi = signal<number | null>(null);
  category = signal<string | null>(null);
  error = signal<string | null>(null);

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

  categoryClass = computed(() => {
    const cat = this.category();
    if (cat === 'Underweight') return 'text-underweight';
    if (cat === 'Normal weight') return 'text-normal';
    if (cat === 'Overweight') return 'text-overweight';
    if (cat === 'Obese') return 'text-obese';
    return '';
  });

  calculate() {
    this.error.set(null);
    const h = this.height();
    const w = this.weight();

    if (h === null || isNaN(h)) {
      this.error.set('Validation Error: Please enter a valid number for height.');
      this.bmi.set(null);
      this.category.set(null);
      return;
    }

    if (w === null || isNaN(w)) {
      this.error.set('Validation Error: Please enter a valid number for weight.');
      this.bmi.set(null);
      this.category.set(null);
      return;
    }

    if (h <= 0 || h > 300) {
      this.error.set('Validation Error: Height must be a positive number between 1 and 300 cm.');
      this.bmi.set(null);
      this.category.set(null);
      return;
    }

    if (w <= 0 || w > 600) {
      this.error.set('Validation Error: Weight must be a positive number between 1 and 600 kg.');
      this.bmi.set(null);
      this.category.set(null);
      return;
    }

    const heightInMeters = h / 100;
    const calculatedBmi = w / (heightInMeters * heightInMeters);
    
    this.bmi.set(calculatedBmi);
    
    if (calculatedBmi < 18.5) {
      this.category.set('Underweight');
    } else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) {
      this.category.set('Normal weight');
    } else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) {
      this.category.set('Overweight');
    } else {
      this.category.set('Obese');
    }
  }
}
