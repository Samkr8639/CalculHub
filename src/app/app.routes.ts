import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  // Future routes for different calculator categories
  { path: 'financial', loadComponent: () => import('./financial/financial.component').then(m => m.FinancialComponent) },
  { path: 'mathematical', loadComponent: () => import('./mathematical/mathematical.component').then(m => m.MathematicalComponent) },
  { path: 'health', loadComponent: () => import('./health/health.component').then(m => m.HealthComponent) },
  { path: 'other', loadComponent: () => import('./other/other.component').then(m => m.OtherComponent) },
  { path: 'about', component: AboutComponent },
  { path: 'blog', loadComponent: () => import('./blog/blog.component').then(m => m.BlogComponent) },
];
