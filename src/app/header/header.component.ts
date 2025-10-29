import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isHidden = signal(false);

  navLinks = signal<{
    label: string;
    path: string;
  }[]>([
    { label: 'Home', path: '/home' },
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
  ]);

  constructor() {
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        this.isHidden.set(true);
      } else {
        this.isHidden.set(false);
      }
      lastScrollY = currentScrollY;
    });
  }
}
