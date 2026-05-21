import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-market',
  imports: [SidePanelComponent, RouterOutlet],
  templateUrl: './market.html',
  styleUrls: ['./market.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketComponent {
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
    const marketRoutes = this.router.config.find(route => route.path === 'market')?.children || [];
    const routeData = marketRoutes.find(route => url.includes(route.path ?? ''));

    return routeData?.data?.['title'] || 'Select a Calculator';
  }
}
