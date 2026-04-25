import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isHidden = signal(false);

  constructor() {
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
