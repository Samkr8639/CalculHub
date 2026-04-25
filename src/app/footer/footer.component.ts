import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  // Social links remain, but styling will be handled by CSS
  socialLinks = [
    { name: 'github', iconName: 'github', link: 'https://github.com/Samkr8639/CalculHub' },
    { name: 'LinkedIn', iconName: 'linkedin', link: 'https://www.linkedin.com/in/sameer-kumar-912a5b212/' },
    { name: 'Instagram', iconName: 'instagram', link: 'https://www.instagram.com/sam_kr_8639/' },
  ];
}
