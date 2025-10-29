import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  // Social links remain, but styling will be handled by CSS
  socialLinks = [
    { name: 'Facebook', link: '#' },
    { name: 'Twitter', link: '#' },
    { name: 'LinkedIn', link: '#' },
    { name: 'Instagram', link: '#' },
  ];
}
