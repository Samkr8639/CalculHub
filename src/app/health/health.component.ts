import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { SidePanelComponent } from '../side-panel/side-panel.component';

@Component({
  selector: 'app-health',
  imports: [SidePanelComponent, RouterOutlet],
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthComponent {
  private router = inject(Router);

  private navigationEnd$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd)
  );

  private currentRoute$ = this.navigationEnd$.pipe(
    map(event => this.getRouteTitle(event.urlAfterRedirects)),
    startWith(this.getRouteTitle(this.router.url))
  );

  activeCalculatorTitle = toSignal(this.currentRoute$, { initialValue: 'Select a Calculator' });

  private getRouteTitle(url: string): string {
    const financialRoutes = this.router.config.find(route => route.path === 'health')?.children || [];
    const routeData = financialRoutes.find(route => url.includes(route.path ?? ''));

    return routeData?.data?.['title'] || 'Select a Calculator';
  }
}
