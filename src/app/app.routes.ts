import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'financial',
    loadComponent: () =>
      import('./financial/financial.component').then(
        (m) => m.FinancialComponent
      ),
    children: [
      {
        path: 'mortgage',
        loadComponent: () =>
          import('./Allcalculators/mortgage-calculator/mortgage-calculator').then(
            (m) => m.MortgageCalculator
          ),
        data: { title: 'Mortgage Calculator' },
      },
      {
        path: 'compound-interest',
        loadComponent: () =>
          import(
            './Allcalculators/compound-interest-calculator/compound-interest-calculator'
          ).then((m) => m.CompoundInterestCalculatorComponent),
        data: { title: 'Compound Interest Calculator' },
      },
      {
        path: 'gst-calculator',
        loadComponent: () =>
          import('./Allcalculators/gst-calculator/gst-calculator.component').then(
            (m) => m.GstCalculatorComponent
          ),
        data: { title: 'GST Calculator' },
      },
      {
        path: 'sip-calculator',
        loadComponent: () =>
          import('./Allcalculators/sip-calculator/sip-calculator.component').then(
            (m) => m.SipCalculatorComponent
          ),
        data: { title: 'SIP Calculator' },
      },
      {
        path: 'fd-calculator',
        loadComponent: () =>
          import('./Allcalculators/fd-calculator/fd-calculator').then(
            (m) => m.FdCalculatorComponent
          ),
        data: { title: 'FD Calculator' },
      },
      {
        path: 'tax-calculator',
        loadComponent: () =>
          import('./Allcalculators/tax-calculator/tax-calculator').then(
            (m) => m.TaxCalculatorComponent
          ),
        data: { title: 'Tax Calculator' },
      },
      {
        path: 'mutual-fund-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/mutual-fund-calculator/mutual-fund-calculator'
          ).then((m) => m.MutualFundCalculatorComponent),
        data: { title: 'Mutual Fund Calculator' },
      },
      {
        path: 'ppf-calculator',
        loadComponent: () =>
          import('./Allcalculators/ppf-calculator/ppf-calculator').then(
            (m) => m.PpfCalculatorComponent
          ),
        data: { title: 'PPF Calculator' },
      },
      {
        path: 'loan-eligibility-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/loan-eligibility-calculator/loan-eligibility-calculator'
          ).then((m) => m.LoanEligibilityCalculatorComponent),
        data: { title: 'Loan Eligibility Calculator' },
      },
      {
        path: 'home-loan-emi-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/home-loan-emi-calculator/home-loan-emi-calculator'
          ).then((m) => m.HomeLoanEmiCalculatorComponent),
        data: { title: 'Home Loan EMI Calculator' },
      },
      {
        path: 'retirement-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/retirement-calculator/retirement-calculator'
          ).then((m) => m.RetirementCalculatorComponent),
        data: { title: 'Retirement Calculator' },
      },
      {
        path: 'investment-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/investment-calculator/investment-calculator'
          ).then((m) => m.InvestmentCalculatorComponent),
        data: { title: 'Investment Calculator' },
      },
      {
        path: 'bike-loan-emi-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/bike-loan-emi-calculator/bike-loan-emi-calculator'
          ).then((m) => m.BikeLoanEmiCalculatorComponent),
        data: { title: 'Bike Loan EMI Calculator' },
      },
      {
        path: 'education-loan-emi-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/education-loan-emi-calculator/education-loan-emi-calculator'
          ).then((m) => m.EducationLoanEmiCalculatorComponent),
        data: { title: 'Education Loan EMI Calculator' },
      },
      { path: '', redirectTo: 'mortgage', pathMatch: 'full' },
    ],
  },
  {
    path: 'mathematical',
    loadComponent: () =>
      import('./mathematical/mathematical').then((m) => m.MathematicalComponent),
    children: [
      {
        path: 'percentage-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/percentage-calculator/percentage-calculator'
          ).then((m) => m.PercentageCalculatorComponent),
        data: { title: 'Percentage Calculator' },
      },
      {
        path: 'scientific-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/scientific-calculator/scientific-calculator'
          ).then((m) => m.ScientificCalculatorComponent),
        data: { title: 'Scientific Calculator' },
      },
      {
        path: 'algebra-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/algebra-calculator/algebra-calculator.component'
          ).then((m) => m.AlgebraCalculatorComponent),
        data: { title: 'Algebra Calculator' },
      },
      {
        path: 'matrix-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/matrix-calculator/matrix-calculator'
          ).then((m) => m.MatrixCalculatorComponent),
        data: { title: 'Matrix Calculator' },
      },
      {
        path: 'statistics-calculator',
        loadComponent: () =>
          import(
            './Allcalculators/statistics-calculator/statistics-calculator'
          ).then((m) => m.StatisticsCalculator),
        data: { title: 'Statistics Calculator' },
      },
      { path: '', redirectTo: 'percentage-calculator', pathMatch: 'full' },
    ],
  },
  {
    path: 'health',
    loadComponent: () =>
      import('./health/health.component').then((m) => m.HealthComponent),
    children: [
      {
        path: 'calorie-calculator',
        loadComponent: () =>
          import('./Allcalculators/calorie-calculator/calorie-calculator').then(
            (m) => m.CalorieCalculatorComponent
          ),
        data: { title: 'Calorie Calculator' },
      },
      // {
      //   path: 'pregnancy',
      //   loadComponent: () =>
      //     import('./health/pregnancy-calculator/pregnancy-calculator').then(
      //       (m) => m.PregnancyCalculatorComponent
      //     ),
      //   data: { title: 'Pregnancy Calculator' },
      // },
      { path: '', redirectTo: 'calorie-calculator', pathMatch: 'full' },
    ],
  },
  {
    path: 'other',
    loadComponent: () =>
      import('./other/other.component').then((m) => m.OtherComponent),
  },
  { path: 'about', component: AboutComponent },
  {
    path: 'blog',
    loadComponent: () => import('./blog/blog.component').then((m) => m.BlogComponent),
  },
];
