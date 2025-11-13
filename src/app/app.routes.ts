import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { FinancialComponent } from './financial/financial.component';
import { MortgageCalculator } from './Allcalculators/mortgage-calculator/mortgage-calculator';
import { CompoundInterestCalculatorComponent } from './Allcalculators/compound-interest-calculator/compound-interest-calculator';
import { GstCalculatorComponent } from './Allcalculators/gst-calculator/gst-calculator.component';
import { SipCalculatorComponent } from './Allcalculators/sip-calculator/sip-calculator.component';
import { FdCalculatorComponent } from './Allcalculators/fd-calculator/fd-calculator';
import { TaxCalculatorComponent } from './Allcalculators/tax-calculator/tax-calculator';
import { MutualFundCalculatorComponent } from './Allcalculators/mutual-fund-calculator/mutual-fund-calculator';
import { PpfCalculatorComponent } from './Allcalculators/ppf-calculator/ppf-calculator';
import { LoanEligibilityCalculatorComponent } from './Allcalculators/loan-eligibility-calculator/loan-eligibility-calculator';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'financial',
    component: FinancialComponent,
    children: [
      { path: 'mortgage', component: MortgageCalculator, data: { title: 'Mortgage Calculator' } },
      { path: 'compound-interest', component: CompoundInterestCalculatorComponent, data: { title: 'Compound Interest Calculator' } },
      { path: 'gst-calculator', component: GstCalculatorComponent, data: { title: 'GST Calculator' } },
      { path: 'sip-calculator', component: SipCalculatorComponent, data: { title: 'SIP Calculator' } },
      { path: 'fd-calculator', component: FdCalculatorComponent, data: { title: 'FD Calculator' } },
      { path: 'tax-calculator', component: TaxCalculatorComponent, data: { title: 'Tax Calculator' } },
      { path: 'mutual-fund-calculator', component: MutualFundCalculatorComponent, data: { title: 'Mutual Fund Calculator' } },
      { path: 'ppf-calculator', component: PpfCalculatorComponent, data: { title: 'PPF Calculator' } },
      { path: 'loan-eligibility-calculator', component: LoanEligibilityCalculatorComponent, data: { title: 'Loan Eligibility Calculator' } },
      { path: '', redirectTo: 'mortgage', pathMatch: 'full' },
    ]
  },
  { path: 'mathematical', loadComponent: () => import('./mathematical/mathematical.component').then(m => m.MathematicalComponent) },
  { path: 'health', loadComponent: () => import('./health/health.component').then(m => m.HealthComponent) },
  { path: 'other', loadComponent: () => import('./other/other.component').then(m => m.OtherComponent) },
  { path: 'about', component: AboutComponent },
  { path: 'blog', loadComponent: () => import('./blog/blog.component').then(m => m.BlogComponent) },
];
