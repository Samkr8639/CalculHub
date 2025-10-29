import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ThemeService } from './theme.service';
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

  // Removed @HostBinding for light-theme as ThemeService will manage body class directly

  ngOnInit() {
    gsap.from('body', { opacity: 0, duration: 1, ease: 'power2.out' });
  }
}
