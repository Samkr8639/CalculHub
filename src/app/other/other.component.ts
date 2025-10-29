import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-other',
  imports: [CommonModule],
  template: '<p>other works!</p>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherComponent {}
