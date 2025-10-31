import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

interface CalculatorCard {
  icon: string;
  title: string;
  description: string;
  link: string;
  category: string;
}

@Component({
  selector: 'app-side-panel',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent {
  private router = inject(Router);

  calculatorCards = signal<CalculatorCard[]>([
    { icon: '💰', title: 'Mortgage Calculator', description: 'Calculate your monthly mortgage payments and amortization schedule.', link: '/financial', category: 'Financial' },
    { icon: '📈', title: 'Compound Interest', description: 'See how your investments grow over time with compound interest.', link: '/financial/compound-interest', category: 'Financial' },
    { icon: '🧾', title: 'GST Calculator', description: 'Quickly add or remove GST from any amount.', link: '/financial/gst', category: 'Financial' },
    { icon: '📊', title: 'SIP Calculator', description: 'Estimate the future value of your Systematic Investment Plans.', link: '/financial/sip', category: 'Financial' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucude-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>', title: 'Paycheck Calculator', description: 'Figure out your net salary after taxes and deductions.', link: '/financial/paycheck', category: 'Financial' },
    { icon: 'ax', title: 'Tax Calculator', description: 'Determine your annual tax liability and effective tax rate.', link: '/financial/tax', category: 'Financial' },
    { icon: '%', title: 'Percentage Calculator', description: 'Solve various percentage problems instantly.', link: '/mathematical/percentage', category: 'Mathematical' },
    { icon: '✖️', title: 'Scientific Calculator', description: 'Perform complex scientific and mathematical operations.', link: '/mathematical/scientific', category: 'Mathematical' },
    { icon: '🧩', title: 'Matrix Calculator', description: 'Execute matrix operations like addition, multiplication, and inverse.', link: '/mathematical/matrix', category: 'Mathematical' },
    { icon: '🏃‍♀️', title: 'Calorie Calculator', description: 'Find your daily calorie needs for weight loss, gain, or maintenance.', link: '/health/calorie', category: 'Health & Fitness' },
    { icon: '🤰', title: 'Pregnancy Calculator', description: 'Estimate your due date and track your pregnancy progress.', link: '/health/pregnancy', category: 'Health & Fitness' },
    { icon: '🏠', title: 'Buy vs. Rent', description: 'Compare the costs of buying and renting a home to make an informed decision.', link: '/other/buy-vs-rent', category: 'Lifestyle & Home' },
    { icon: '🤑', title: 'Millionaire Calculator', description: 'Discover how long it will take to reach your millionaire goal.', link: '/other/millionaire', category: 'Lifestyle & Home' },
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

  isActive(link: string): boolean {
    return this.router.url === link;
  }
}
