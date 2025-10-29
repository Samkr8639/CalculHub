import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-financial',
  imports: [CommonModule],
  template: '<p>financial works!</p>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialComponent {}
