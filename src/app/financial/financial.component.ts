import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-financial',
  imports: [SidePanelComponent, RouterOutlet],
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialComponent {
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
    const financialRoutes = this.router.config.find(route => route.path === 'financial')?.children || [];
    const routeData = financialRoutes.find(route => url.includes(route.path ?? ''));

    return routeData?.data?.['title'] || 'Select a Calculator';
  }
}
