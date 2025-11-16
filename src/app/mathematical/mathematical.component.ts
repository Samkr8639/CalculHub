import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidePanelComponent } from '../side-panel/side-panel.component';

@Component({
  selector: 'app-mathematical',
  templateUrl: './mathematical.component.html',
  styleUrls: ['./mathematical.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, SidePanelComponent],
})
export class MathematicalComponent {
  mathematicalCalculators = [
    { name: 'Percentage Calculator', route: 'percentage' },
    { name: 'Scientific Calculator', route: 'scientific' },
    { name: 'Algebra Calculator', route: 'algebra' },
    { name: 'Matrix Calculator', route: 'matrix' },
    { name: 'Statistics Calculator', route: 'statistics' },
  ];
}
