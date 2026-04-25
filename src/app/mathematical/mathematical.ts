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
    const mathRoute = this.router.config.find(r => r.path === 'mathematical');
    if (!mathRoute || !mathRoute.children) return 'Select a Calculator';
    const childRoute = mathRoute.children.find(r => r.path && url.includes(r.path));
    return childRoute?.data?.['title'] || 'Select a Calculator';
  }
}
