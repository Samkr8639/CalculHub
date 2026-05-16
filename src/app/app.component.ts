import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ThemeService } from './theme.service';
import { SeoService } from './services/seo.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.seoService.init();
    if (isPlatformBrowser(this.platformId)) {
      gsap.from('body', { opacity: 0, duration: 1, ease: 'power2.out' });
    }
  }
}
