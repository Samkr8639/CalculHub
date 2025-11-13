import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-mathematical',
  imports: [CommonModule, SidePanelComponent, RouterOutlet],
  templateUrl: './mathematical.html',
  styleUrls: ['./mathematical.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MathematicalComponent {
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
    const routeData = this.router.config
      .flatMap(route => route.children || [route])
      .find(route => url.includes(route.path ?? ''));

    return routeData?.data?.['title'] || 'Select a Calculator';
  }
}
