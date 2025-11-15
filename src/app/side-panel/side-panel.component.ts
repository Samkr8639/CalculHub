import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit, OnDestroy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CalculatorSelectionService } from '../calculator-selection.service';
import { Subscription, filter } from 'rxjs';

interface CalculatorCard {
  icon: string;
  title: string;
  description: string;
  link: string;
  category: string;
}

@Component({
  selector: 'app-side-panel',
  imports: [CommonModule, RouterLink],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private calculatorSelectionService = inject(CalculatorSelectionService);
  private subscription = new Subscription();

  public calculators = input<any[]>();

  activeLink = signal<string | null>(null);

  calculatorCards = signal<CalculatorCard[]>([
    { icon: '', title: 'Mortgage Calculator', description: 'Calculate your monthly mortgage payments and amortization schedule.', link: '/financial/mortgage', category: 'Financial' },
    { icon: '', title: 'Home Loan EMI Calculator', description: 'Calculate your monthly home loan payments (EMI) and see a breakdown of principal and interest.', link: '/financial/home-loan-emi-calculator', category: 'Financial' },
    { icon: '', title: 'Bike Loan EMI Calculator', description: 'Calculate your monthly bike loan payments (EMI) and see a breakdown of principal and interest.', link: '/financial/bike-loan-emi-calculator', category: 'Financial' },
    { icon: '', title: 'Education Loan EMI Calculator', description: 'Calculate your monthly education loan payments (EMI) considering the moratorium period.', link: '/financial/education-loan-emi-calculator', category: 'Financial' },
    { icon: '', title: 'Retirement Calculator', description: 'Plan your retirement by estimating your required corpus and savings.', link: '/financial/retirement-calculator', category: 'Financial' },
    { icon: '', title: 'Investment Calculator', description: 'Calculate the future value of your investments based on initial, monthly, and annual contributions.', link: '/financial/investment-calculator', category: 'Financial' },
    { icon: '', title: 'Compound Interest', description: 'See how your investments grow over time with compound interest.', link: '/financial/compound-interest', category: 'Financial' },
    { icon: '', title: 'GST Calculator', description: 'Quickly add or remove GST from any amount.', link: '/financial/gst-calculator', category: 'Financial' },
    { icon: '', title: 'SIP Calculator', description: 'Estimate the future value of your Systematic Investment Plans.', link: '/financial/sip-calculator', category: 'Financial' },
    { icon: '', title: 'Mutual Fund Calculator', description: 'Helps you calculate the absolute or annualized (XIRR) returns on your existing mutual fund investments.', link: '/financial/mutual-fund-calculator', category: 'Financial' },
    { icon: '', title: 'FD Calculator', description: 'Calculate FD returns with simple or compound interest.', link: '/financial/fd-calculator', category: 'Financial' },
    { icon: '', title: 'PPF Calculator', description: 'Estimates the maturity value of your PPF account, which has a 15-year lock-in period.', link: '/financial/ppf-calculator', category: 'Financial' },
    { icon: '', title: 'Income Tax Calculator', description: 'Determine your annual tax liability and effective tax rate.', link: '/financial/tax-calculator', category: 'Financial' },
    { icon: '', title: 'Loan Eligibility Calculator', description: 'Estimates the maximum loan amount you are likely to be approved for based on your income and existing debts.', link: '/financial/loan-eligibility-calculator', category: 'Financial' },
    { icon: '', title: 'Percentage Calculator', description: 'Solve various percentage problems instantly.', link: '/mathematical/percentage-calculator', category: 'Mathematical' },
    { icon: '', title: 'Scientific Calculator', description: 'Perform complex scientific and mathematical operations.', link: '/mathematical/scientific-calculator', category: 'Mathematical' },
    { icon: '', title: 'Calorie Calculator', description: 'Find your daily calorie needs for weight loss, gain, or maintenance.', link: '/health/calorie', category: 'Health & Fitness' },
    { icon: '', title: 'Pregnancy Calculator', description: 'Estimate your due date and track your pregnancy progress.', link: '/health/pregnancy', category: 'Health & Fitness' },
    { icon: '', title: 'Buy vs. Rent', description: 'Compare the costs of buying and renting a home to make an informed decision.', link: '/other/buy-vs-rent', category: 'Lifestyle & Home' },
    { icon: '', title: 'Millionaire Calculator', description: 'Discover how long it will take to reach your millionaire goal.', link: '/other/millionaire', category: 'Lifestyle & Home' },
  ]);

  categorizedCalculators = computed(() => {
    const categories: { [key: string]: CalculatorCard[] } = {};
    this.calculatorCards().forEach(card => {
      if (!categories[card.category]) {
        categories[card.category] = [];
      }
      categories[card.category].push(card);
    });
    return categories;
  });

  categoryKeys = computed(() => Object.keys(this.categorizedCalculators()));

  ngOnInit(): void {
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.updateActiveLinkFromRoute();
      })
    );
    this.subscription.add(
      this.calculatorSelectionService.selectedCalculator$.subscribe(title => {
        if (title) {
          const card = this.calculatorCards().find(c => c.title === title);
          if (card) {
            this.activeLink.set(card.link);
          }
        }
      })
    );
    this.updateActiveLinkFromRoute();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateActiveLinkFromRoute(): void {
    const currentUrl = this.router.url;
    let mostSpecificMatch: string | null = null;

    this.calculatorCards().forEach(card => {
      if (currentUrl.startsWith(card.link)) {
        if (!mostSpecificMatch || card.link.length > mostSpecificMatch.length) {
          mostSpecificMatch = card.link;
        }
      }
    });
    this.activeLink.set(mostSpecificMatch);
  }

  isActive(link: string): boolean {
    return this.activeLink() === link;
  }

  onCalculatorClick(cardTitle: string): void {
    this.calculatorSelectionService.setSelectedCalculator(cardTitle);
    const card = this.calculatorCards().find(c => c.title === cardTitle);
    if (card) {
      this.activeLink.set(card.link);
    }
  }
}
