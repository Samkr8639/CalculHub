import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mathematical',
  imports: [CommonModule],
  template: '<p>mathematical works!</p>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MathematicalComponent {}
