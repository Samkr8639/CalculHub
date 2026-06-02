import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';
import { MobileMenuService } from '../services/mobile-menu.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private router = inject(Router);

  isCalculatorsActive = signal(false);
  hasSidePanel = signal(false);

  mobileMenuService = inject(MobileMenuService);
  isMobileMenuOpen = this.mobileMenuService.isOpen;

  toggleMobileMenu() {
    this.mobileMenuService.toggle();
  }

  closeMobileMenu() {
    this.mobileMenuService.close();
  }

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.mobileMenuService.close();
      this.isCalculatorsActive.set(
        url.startsWith('/financial') ||
        url.startsWith('/mathematical') ||
        url.startsWith('/health') ||
        url.startsWith('/other') ||
        url.startsWith('/market') ||
        url.startsWith('/sitemap')
      );
      this.hasSidePanel.set(
        url.startsWith('/financial') ||
        url.startsWith('/mathematical') ||
        url.startsWith('/health') ||
        url.startsWith('/market')
      );
    });
  }
}
