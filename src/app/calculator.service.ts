import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private selectedCalculatorSource = new BehaviorSubject<string | null>(null);
  selectedCalculator$ = this.selectedCalculatorSource.asObservable();

  selectCalculator(calculatorTitle: string) {
    this.selectedCalculatorSource.next(calculatorTitle);
  }
}
