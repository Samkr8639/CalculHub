import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  imports: [RouterLink],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsComponent {
  lastUpdated = 'June 13, 2025';
}
