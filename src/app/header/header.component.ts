import { ChangeDetectionStrategy, Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  
  isHidden = signal(false);
  isCalculatorsActive = signal(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.isCalculatorsActive.set(
        url.startsWith('/financial') || 
        url.startsWith('/mathematical') || 
        url.startsWith('/health') || 
        url.startsWith('/other') ||
        url.startsWith('/sitemap')
      );
    });

    if (isPlatformBrowser(this.platformId)) {
      let lastScrollY = window.scrollY;

      fromEvent(window, 'scroll')
        .pipe(
          map(() => {
            const currentScrollY = window.scrollY;
            const hidden = currentScrollY > lastScrollY && currentScrollY > 200;
            lastScrollY = currentScrollY;
            return hidden;
          }),
          distinctUntilChanged(),
          takeUntilDestroyed()
        )
        .subscribe((hidden) => this.isHidden.set(hidden));
    }
  }
}
