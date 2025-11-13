import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculatorSelectionService {
  private selectedCalculatorSubject = new BehaviorSubject<string | null>(null);
  selectedCalculator$ = this.selectedCalculatorSubject.asObservable();

  setSelectedCalculator(calculatorTitle: string) {
    this.selectedCalculatorSubject.next(calculatorTitle);
  }
}
