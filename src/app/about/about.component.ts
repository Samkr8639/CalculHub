import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  template: '<p>about works!</p>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
