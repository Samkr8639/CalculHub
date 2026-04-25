import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bmi-calculator',
  imports: [CommonModule, FormsModule],
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

    if (!h || !w || h <= 0 || w <= 0) {
      this.error.set('Please enter valid positive numbers for height and weight.');
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
