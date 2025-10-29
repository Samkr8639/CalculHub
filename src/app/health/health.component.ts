import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-health',
  imports: [CommonModule],
  template: '<p>health works!</p>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthComponent {}
