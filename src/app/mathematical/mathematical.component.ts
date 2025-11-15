import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { CalculatorSelectionService } from '../calculator-selection.service';

@Component({
  selector: 'app-mathematical',
  imports: [CommonModule, FormsModule, SidePanelComponent, RouterModule],
  templateUrl: './mathematical.component.html',
  styleUrls: ['./mathematical.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MathematicalComponent implements OnInit, OnDestroy {
  private calculatorSelectionService = inject(CalculatorSelectionService);
  private subscription: Subscription;

  selectedCalculator = signal<string | null>(null);
  mathematicalCalculators = [
    { title: 'Percentage Calculator', link: 'percentage-calculator' },
    { title: 'Scientific Calculator', link: 'scientific-calculator' },
    { title: 'Algebra Calculator', link: 'algebra-calculator' },
  ];

  constructor() {
    this.subscription = this.calculatorSelectionService.selectedCalculator$.subscribe(title => {
      this.selectedCalculator.set(title);
    });
  }

  ngOnInit(): void {
    if (this.selectedCalculator() === null) {
      this.calculatorSelectionService.setSelectedCalculator('Percentage Calculator');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
