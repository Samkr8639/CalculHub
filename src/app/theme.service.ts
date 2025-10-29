import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkTheme = signal<boolean>(false);

  constructor() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.isDarkTheme.set(storedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkTheme.set(prefersDark);
    }

    effect(() => {
      const newTheme = this.isDarkTheme() ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      if (this.isDarkTheme()) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  }

  toggleTheme() {
    this.isDarkTheme.update(value => !value);
  }
}
