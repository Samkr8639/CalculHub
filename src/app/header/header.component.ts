import { ChangeDetectionStrategy, Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { fromEvent, EMPTY } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private platformId = inject(PLATFORM_ID);
  isHidden = signal(false);

  constructor() {
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
