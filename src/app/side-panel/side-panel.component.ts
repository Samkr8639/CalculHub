import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit, OnDestroy, input } from '@angular/core';

import { LucideAngularModule } from 'lucide-angular';
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
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private calculatorSelectionService = inject(CalculatorSelectionService);
  private subscription = new Subscription();
  activeLink = signal<string | null>(null);

  collapsedCategories = signal<{[key: string]: boolean}>({
    'Financial': true,
    'Mathematical': true,
    'Health & Fitness': true,
    'Lifestyle & Home': true,
  });

  calculatorCards = signal<CalculatorCard[]>([
    { icon: 'house', title: 'Mortgage Calculator', description: 'Calculate your monthly mortgage payments and amortization schedule.', link: '/financial/mortgage', category: 'Financial' },
    { icon: 'building', title: 'Home Loan EMI Calculator', description: 'Calculate your monthly home loan payments (EMI) and see a breakdown of principal and interest.', link: '/financial/home-loan-emi-calculator', category: 'Financial' },
    { icon: 'bike', title: 'Bike Loan EMI Calculator', description: 'Calculate your monthly bike loan payments (EMI) and see a breakdown of principal and interest.', link: '/financial/bike-loan-emi-calculator', category: 'Financial' },
    { icon: 'graduation-cap', title: 'Education Loan EMI Calculator', description: 'Calculate your monthly education loan payments (EMI) considering the moratorium period.', link: '/financial/education-loan-emi-calculator', category: 'Financial' },
    { icon: 'calendar', title: 'Retirement Calculator', description: 'Plan your retirement by estimating your required corpus and savings.', link: '/financial/retirement-calculator', category: 'Financial' },
    { icon: 'trending-up', title: 'Investment Calculator', description: 'Calculate the future value of your investments based on initial, monthly, and annual contributions.', link: '/financial/investment-calculator', category: 'Financial' },
    { icon: 'trending-up', title: 'Compound Interest', description: 'See how your investments grow over time with compound interest.', link: '/financial/compound-interest', category: 'Financial' },
    { icon: 'receipt', title: 'GST Calculator', description: 'Quickly add or remove GST from any amount.', link: '/financial/gst-calculator', category: 'Financial' },
    { icon: 'piggy-bank', title: 'SIP Calculator', description: 'Estimate the future value of your Systematic Investment Plans.', link: '/financial/sip-calculator', category: 'Financial' },
    { icon: 'bar-chart-3', title: 'Mutual Fund Calculator', description: 'Helps you calculate the absolute or annualized (XIRR) returns on your existing mutual fund investments.', link: '/financial/mutual-fund-calculator', category: 'Financial' },
    { icon: 'landmark', title: 'FD Calculator', description: 'Calculate FD returns with simple or compound interest.', link: '/financial/fd-calculator', category: 'Financial' },
    { icon: 'vault', title: 'PPF Calculator', description: 'Estimates the maturity value of your PPF account, which has a 15-year lock-in period.', link: '/financial/ppf-calculator', category: 'Financial' },
    { icon: 'file-text', title: 'Income Tax Calculator', description: 'Determine your annual tax liability and effective tax rate.', link: '/financial/tax-calculator', category: 'Financial' },
    { icon: 'badge-check', title: 'Loan Eligibility Calculator', description: 'Estimates the maximum loan amount you are likely to be approved for based on your income and existing debts.', link: '/financial/loan-eligibility-calculator', category: 'Financial' },
    { icon: 'percent', title: 'Percentage Calculator', description: 'Solve various percentage problems instantly.', link: '/mathematical/percentage-calculator', category: 'Mathematical' },
    { icon: 'calculator', title: 'Scientific Calculator', description: 'Perform complex scientific and mathematical operations.', link: '/mathematical/scientific-calculator', category: 'Mathematical' },
    { icon: 'square-function', title: 'Algebra Calculator', description: 'Solve equations, factor polynomials, and graph inequalities.', link: '/mathematical/algebra-calculator', category: 'Mathematical' },
    { icon: 'grid-2x2', title: 'Matrix Calculator', description: 'Perform matrix operations, such as addition, subtraction, and multiplication.', link: '/mathematical/matrix-calculator', category: 'Mathematical' },
    { icon: 'sigma', title: 'Statistics Calculator', description: 'Calculate various statistics, such as mean, median, and mode.', link: '/mathematical/statistics-calculator', category: 'Mathematical' },
    { icon: 'activity', title: 'Calorie Calculator', description: 'Find your daily calorie needs for weight loss, gain, or maintenance.', link: '/health/calorie-calculator', category: 'Health & Fitness' },
    { icon: 'scale', title: 'BMI Calculator', description: 'Measure weight relative to height to categorize body mass index.', link: '/health/bmi-calculator', category: 'Health & Fitness' },
    { icon: 'user', title: 'Body Fat Calculator', description: 'Estimate fat percentage, lean body mass, and fat mass using body measurements.', link: '/health/body-fat-calculator', category: 'Health & Fitness' },
    { icon: 'target', title: 'Ideal Weight Calculator', description: 'Determine a target healthy weight range based on height, age, and gender.', link: '/health/ideal-weight-calculator', category: 'Health & Fitness' },
    { icon: 'house', title: 'Buy vs. Rent', description: 'Compare the costs of buying and renting a home to make an informed decision.', link: '/other/buy-vs-rent', category: 'Lifestyle & Home' },
    { icon: 'trending-up', title: 'Millionaire Calculator', description: 'Discover how long it will take to reach your millionaire goal.', link: '/other/millionaire', category: 'Lifestyle & Home' },
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
            this.expandCategory(card.category);
          }
        }
      })
    );
    this.updateActiveLinkFromRoute();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleCategory(category: string): void {
    this.collapsedCategories.update(current => ({
      ...current,
      [category]: !current[category]
    }));
  }

  private expandCategory(categoryToExpand: string): void {
    const newCollapsedState = this.categoryKeys().reduce((acc, key) => {
      acc[key] = key !== categoryToExpand;
      return acc;
    }, {} as { [key: string]: boolean });
    this.collapsedCategories.set(newCollapsedState);
  }

  private updateActiveLinkFromRoute(): void {
    const currentUrl = this.router.url;
    let mostSpecificMatch: string | null = null;
    let activeCategory: string | null = null;

    this.calculatorCards().forEach(card => {
      if (currentUrl.startsWith(card.link)) {
        if (!mostSpecificMatch || card.link.length > mostSpecificMatch.length) {
          mostSpecificMatch = card.link;
          activeCategory = card.category;
        }
      }
    });
    this.activeLink.set(mostSpecificMatch);
    if (activeCategory) {
      this.expandCategory(activeCategory);
    }
  }

  isActive(link: string): boolean {
    return this.activeLink() === link;
  }

  onCalculatorClick(cardTitle: string): void {
    this.calculatorSelectionService.setSelectedCalculator(cardTitle);
    const card = this.calculatorCards().find(c => c.title === cardTitle);
    if (card) {
      this.activeLink.set(card.link);
      this.expandCategory(card.category);
    }
  }
}
