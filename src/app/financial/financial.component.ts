import { ChangeDetectionStrategy, Component, signal, computed, ViewChild, ElementRef, AfterViewInit, OnDestroy, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import Chart from 'chart.js/auto';
import { MortgageCalculator } from "../Allcalculators/mortgage-calculator/mortgage-calculator";
import { CalculatorSelectionService } from '../calculator-selection.service';
import { Subscription } from 'rxjs';
import { CompoundInterestCalculatorComponent } from "../Allcalculators/compound-interest-calculator/compound-interest-calculator";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-financial',
  imports: [CommonModule, FormsModule, SidePanelComponent, RouterModule],
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialComponent implements OnInit, OnDestroy {
  private calculatorSelectionService = inject(CalculatorSelectionService);
  private subscription: Subscription;

  selectedCalculator = signal<string | null>(null);

  constructor() {
    this.subscription = this.calculatorSelectionService.selectedCalculator$.subscribe(title => {
      this.selectedCalculator.set(title);
    });
  }

  ngOnInit(): void {
    // Set a default calculator if none is selected, e.g., when directly navigating to /financial
    if (this.selectedCalculator() === null) {
      this.calculatorSelectionService.setSelectedCalculator('Mortgage Calculator');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
