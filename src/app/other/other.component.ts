import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-other',
  imports: [],
  template: '<p>other works!</p>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherComponent {}
