import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface CalcEntry { name: string; link: string; desc: string; }

@Component({
  selector: 'app-sitemap',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sitemap-container">
      <h1>All Calculators — Site Directory</h1>
      <p class="sitemap-intro">Browse all free calculators available on CalculHub, organized by category. No login required.</p>

      <section class="sitemap-category">
        <h2>💰 Financial Calculators</h2>
        <ul>
          @for (c of financial; track c.link) {
            <li><a [routerLink]="c.link"><strong>{{ c.name }}</strong></a> — {{ c.desc }}</li>
          }
        </ul>
      </section>

      <section class="sitemap-category">
        <h2>📐 Mathematical Calculators</h2>
        <ul>
          @for (c of mathematical; track c.link) {
            <li><a [routerLink]="c.link"><strong>{{ c.name }}</strong></a> — {{ c.desc }}</li>
          }
        </ul>
      </section>

      <section class="sitemap-category">
        <h2>🏃 Health & Fitness Calculators</h2>
        <ul>
          @for (c of health; track c.link) {
            <li><a [routerLink]="c.link"><strong>{{ c.name }}</strong></a> — {{ c.desc }}</li>
          }
        </ul>
      </section>
    </div>
  `,
  styles: [`
    .sitemap-container { max-width: 900px; margin: 2rem auto; padding: 1rem 2rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .sitemap-intro { color: var(--text-secondary, #888); margin-bottom: 2rem; }
    .sitemap-category { margin-bottom: 2rem; }
    .sitemap-category h2 { font-size: 1.3rem; border-bottom: 2px solid var(--accent, #e11931); padding-bottom: 0.4rem; margin-bottom: 1rem; }
    ul { list-style: none; padding: 0; }
    li { padding: 0.4rem 0; }
    a { color: var(--accent, #e11931); text-decoration: none; }
    a:hover { text-decoration: underline; }
  `]
})
export class SitemapComponent {
  financial: CalcEntry[] = [
    { name: 'Mortgage Calculator', link: '/financial/mortgage', desc: 'Calculate monthly mortgage payments and amortization schedule.' },
    { name: 'Compound Interest Calculator', link: '/financial/compound-interest', desc: 'See how investments grow with compound interest.' },
    { name: 'GST Calculator', link: '/financial/gst-calculator', desc: 'Add or remove GST from any amount instantly.' },
    { name: 'SIP Calculator', link: '/financial/sip-calculator', desc: 'Estimate future value of Systematic Investment Plans.' },
    { name: 'Fixed Deposit Calculator', link: '/financial/fd-calculator', desc: 'Calculate FD maturity amount and interest earned.' },
    { name: 'Income Tax Calculator', link: '/financial/tax-calculator', desc: 'Calculate income tax liability for FY 2024-25.' },
    { name: 'Mutual Fund Returns Calculator', link: '/financial/mutual-fund-calculator', desc: 'Calculate absolute or XIRR returns on mutual funds.' },
    { name: 'PPF Calculator', link: '/financial/ppf-calculator', desc: 'Estimate PPF maturity value after 15 years.' },
    { name: 'Loan Eligibility Calculator', link: '/financial/loan-eligibility-calculator', desc: 'Find the maximum loan amount you qualify for.' },
    { name: 'Home Loan EMI Calculator', link: '/financial/home-loan-emi-calculator', desc: 'Calculate monthly home loan EMI.' },
    { name: 'Retirement Calculator', link: '/financial/retirement-calculator', desc: 'Plan retirement corpus based on expenses and returns.' },
    { name: 'Investment Calculator', link: '/financial/investment-calculator', desc: 'Calculate future value of investments.' },
    { name: 'Bike Loan EMI Calculator', link: '/financial/bike-loan-emi-calculator', desc: 'Calculate two-wheeler loan EMI.' },
    { name: 'Education Loan EMI Calculator', link: '/financial/education-loan-emi-calculator', desc: 'Calculate education loan EMI with moratorium.' },
  ];

  mathematical: CalcEntry[] = [
    { name: 'Percentage Calculator', link: '/mathematical/percentage-calculator', desc: 'Solve any percentage problem instantly.' },
    { name: 'Scientific Calculator', link: '/mathematical/scientific-calculator', desc: 'Advanced scientific calculator with trig, log, and more.' },
    { name: 'Algebra Calculator', link: '/mathematical/algebra-calculator', desc: 'Solve equations and factor polynomials.' },
    { name: 'Matrix Calculator', link: '/mathematical/matrix-calculator', desc: 'Perform matrix addition, multiplication, and inversion.' },
    { name: 'Statistics Calculator', link: '/mathematical/statistics-calculator', desc: 'Calculate mean, median, mode, and standard deviation.' },
  ];

  health: CalcEntry[] = [
    { name: 'Calorie Calculator (TDEE)', link: '/health/calorie-calculator', desc: 'Find daily calorie needs for your fitness goals.' },
    { name: 'BMI Calculator', link: '/health/bmi-calculator', desc: 'Calculate Body Mass Index from height and weight.' },
    { name: 'Body Fat Calculator', link: '/health/body-fat-calculator', desc: 'Estimate body fat percentage using body measurements.' },
    { name: 'Ideal Weight Calculator', link: '/health/ideal-weight-calculator', desc: 'Find your ideal healthy weight range.' },
  ];
}
