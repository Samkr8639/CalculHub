import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { FinancialComponent } from './financial/financial.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'financial',
    component: FinancialComponent,
    children: [
      { path: 'mortgage', component: FinancialComponent }, // Default to mortgage if no child specified
      { path: 'compound-interest', component: FinancialComponent },
      { path: '', redirectTo: 'mortgage', pathMatch: 'full' }, // Redirect to mortgage by default
    ]
  },
  { path: 'mathematical', loadComponent: () => import('./mathematical/mathematical.component').then(m => m.MathematicalComponent) },
  { path: 'health', loadComponent: () => import('./health/health.component').then(m => m.HealthComponent) },
  { path: 'other', loadComponent: () => import('./other/other.component').then(m => m.OtherComponent) },
  { path: 'about', component: AboutComponent },
  { path: 'blog', loadComponent: () => import('./blog/blog.component').then(m => m.BlogComponent) },
];
