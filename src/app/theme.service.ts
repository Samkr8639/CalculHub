import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  isDarkTheme = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        this.isDarkTheme.set(storedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDarkTheme.set(prefersDark);
      }
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const newTheme = this.isDarkTheme() ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        if (this.isDarkTheme()) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }
    });
  }

  toggleTheme() {
    this.isDarkTheme.update(value => !value);
  }
}
