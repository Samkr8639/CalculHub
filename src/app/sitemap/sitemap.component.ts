import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

interface CalcEntry { name: string; link: string; desc: string; icon: string; }

@Component({
  selector: 'app-sitemap',
  imports: [RouterLink, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sitemap-container">
      <div class="sitemap-hero">
        <h1 class="gradient-text">All Calculators & Tools</h1>
        <p class="sitemap-intro">Explore our suite of 27 premium, free online calculators designed to simplify your everyday math, financial, fitness, and market calculations.</p>
      </div>

      <div class="sitemap-controls">
        <div class="search-wrapper">
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search calculators (e.g. EMI, compound, BMR)..."
            class="search-input"
          />
          <span class="search-icon">
            <lucide-icon name="search" [size]="18"></lucide-icon>
          </span>
          @if (searchQuery()) {
            <button class="clear-search" (click)="searchQuery.set('')">
              <lucide-icon name="x" [size]="18"></lucide-icon>
            </button>
          }
        </div>

        <div class="category-tabs">
          <button
            [class.active]="selectedCategory() === 'all'"
            (click)="selectedCategory.set('all')"
            class="tab-btn">All Tools</button>
          <button
            [class.active]="selectedCategory() === 'financial'"
            (click)="selectedCategory.set('financial')"
            class="tab-btn">Financial</button>
          <button
            [class.active]="selectedCategory() === 'mathematical'"
            (click)="selectedCategory.set('mathematical')"
            class="tab-btn">Mathematical</button>
          <button
            [class.active]="selectedCategory() === 'health'"
            (click)="selectedCategory.set('health')"
            class="tab-btn">Health & Fitness</button>
          <button
            [class.active]="selectedCategory() === 'market'"
            (click)="selectedCategory.set('market')"
            class="tab-btn">Markets & Rates</button>
          <button
            [class.active]="selectedCategory() === 'utility'"
            (click)="selectedCategory.set('utility')"
            class="tab-btn">Utility</button>
        </div>
      </div>

      @if (categories().length > 0) {
        @for (cat of categories(); track cat.key) {
          <section class="sitemap-category">
            <h2 class="category-title">
              <span class="category-icon">
                <lucide-icon
                  [name]="cat.key === 'financial' ? 'banknote' : cat.key === 'mathematical' ? 'sigma' : cat.key === 'health' ? 'HeartPulse' : cat.key === 'utility' ? 'wrench' : 'bitcoin'"
                  [size]="22"
                ></lucide-icon>
              </span>
              {{ cat.title }}
            </h2>
            
            <div class="calc-grid">
              @for (c of cat.items; track c.link) {
                <a [routerLink]="c.link" class="calc-card">
                  <div class="card-top">
                    <div class="card-icon-wrapper">
                      <lucide-icon [name]="c.icon" [size]="22"></lucide-icon>
                    </div>
                    <span class="card-badge" [class]="cat.key">
                      {{ cat.key === 'financial' ? 'Finance' : cat.key === 'mathematical' ? 'Math' : cat.key === 'health' ? 'Health' : cat.key === 'utility' ? 'Utility' : 'Market' }}
                    </span>
                  </div>
                  
                  <div class="card-body">
                    <h3>{{ c.name }}</h3>
                    <p>{{ c.desc }}</p>
                  </div>
                  
                  <div class="card-action">
                    <span>Open Calculator</span>
                    <span class="arrow">
                      <lucide-icon name="arrow-right" [size]="14"></lucide-icon>
                    </span>
                  </div>
                </a>
              }
            </div>
          </section>
        }
      } @else {
        <div class="no-results">
          <span class="no-results-icon">
            <lucide-icon name="search" [size]="40"></lucide-icon>
          </span>
          <h3>No Calculators Found</h3>
          <p>We couldn't find any calculators matching "{{ searchQuery() }}". Try adjusting your search term.</p>
          <button class="reset-btn" (click)="searchQuery.set(''); selectedCategory.set('all')">
            Reset Filters
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .sitemap-container {
      max-width: 1200px;
      margin: 3rem auto;
      padding: 0 1.5rem;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .sitemap-hero {
      text-align: center;
      margin-bottom: 3.5rem;
    }

    .gradient-text {
      display: inline-block;
      font-size: 3rem;
      font-weight: 900;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #ffffff 30%, #e11931 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.3;
      padding-top: 0.1em;
      padding-bottom: 0.15em;
    }

    .sitemap-intro {
      font-size: 1.15rem;
      max-width: 760px;
      margin: 0 auto;
      line-height: 1.6;
      color: var(--light-grey-text);
    }

    .sitemap-controls {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 3rem;
      background: rgba(21, 21, 21, 0.6);
      border: 1px solid var(--border-grey);
      backdrop-filter: blur(12px);
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .search-wrapper {
      position: relative;
      width: 100%;
    }

    .search-input {
      width: 100%;
      padding: 1.1rem 1.5rem 1.1rem 3.2rem;
      background: #0d0d0d;
      border: 1px solid #333;
      border-radius: 12px;
      color: white;
      font-size: 1.05rem;
      font-family: inherit;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-red);
      box-shadow: 0 0 0 3px rgba(225, 25, 49, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.8);
      background: #000;
    }

    .search-icon {
      position: absolute;
      left: 1.2rem;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .clear-search {
      position: absolute;
      right: 1.2rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: #888;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
    }

    .clear-search:hover {
      color: white;
    }

    .category-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .tab-btn {
      padding: 0.65rem 1.25rem;
      background: #111;
      border: 1px solid #2a2a2a;
      color: var(--light-grey-text);
      font-size: 0.95rem;
      border-radius: 30px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.25s ease;
    }

    .tab-btn:hover {
      border-color: #555;
      color: white;
      transform: translateY(-1px);
    }

    .tab-btn.active {
      background: var(--primary-red);
      border-color: var(--primary-red);
      color: white;
      box-shadow: 0 4px 12px rgba(225, 25, 49, 0.3);
    }

    .sitemap-category {
      margin-bottom: 4rem;
    }

    .category-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-grey);
      padding-bottom: 0.75rem;
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .category-icon {
      color: var(--primary-red);
      display: flex;
      align-items: center;
    }

    .category-title::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 60px;
      height: 2px;
      background: var(--primary-red);
    }

    .calc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .calc-card {
      background: rgba(21, 21, 21, 0.5);
      border: 1px solid var(--border-grey);
      border-radius: 16px;
      padding: 1.75rem;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 200px;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(8px);
    }

    .calc-card:hover {
      transform: translateY(-6px);
      border-color: rgba(225, 25, 49, 0.5);
      background: rgba(25, 25, 25, 0.8);
      box-shadow: 0 16px 32px rgba(225, 25, 49, 0.15), 0 4px 8px rgba(0, 0, 0, 0.6);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
      width: 100%;
    }

    .card-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: var(--primary-red);
      transition: all 0.3s ease;
    }

    .calc-card:hover .card-icon-wrapper {
      background: rgba(225, 25, 49, 0.1);
      border-color: rgba(225, 25, 49, 0.25);
      color: white;
      transform: scale(1.05);
    }

    .card-badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      font-size: 0.72rem;
      font-weight: 600;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .card-badge.financial { background: rgba(56, 189, 248, 0.08); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.15); }
    .card-badge.mathematical { background: rgba(192, 132, 252, 0.08); color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.15); }
    .card-badge.health { background: rgba(52, 211, 153, 0.08); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.15); }
    .card-badge.market { background: rgba(251, 191, 36, 0.08); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.15); }
    .card-badge.utility { background: rgba(225, 25, 49, 0.08); color: #e11931; border: 1px solid rgba(225, 25, 49, 0.15); }

    .calc-card h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.6rem;
      transition: color 0.2s ease;
      line-height: 1.4;
    }

    .calc-card:hover h3 {
      color: var(--primary-red);
    }

    .calc-card p {
      font-size: 0.92rem;
      color: var(--light-grey-text);
      line-height: 1.5;
      margin-bottom: 1.5rem;
      flex-grow: 1;
    }

    .card-action {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary-red);
      transition: gap 0.2s ease;
      margin-top: auto;
    }

    .calc-card:hover .card-action {
      gap: 0.7rem;
    }

    .arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }

    .calc-card:hover .arrow {
      transform: translateX(2px);
    }

    .no-results {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--card-black);
      border: 1px dashed #333;
      border-radius: 16px;
      margin-top: 2rem;
    }

    .no-results-icon {
      color: #555;
      display: inline-block;
      margin-bottom: 1rem;
    }

    .no-results h3 {
      font-size: 1.4rem;
      margin-bottom: 0.5rem;
    }

    .no-results p {
      color: var(--light-grey-text);
      margin-bottom: 1.5rem;
    }

    .reset-btn {
      background: var(--primary-red);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .reset-btn:hover {
      background: color-mix(in srgb, var(--primary-red), black 10%);
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .sitemap-container {
        margin: 1.5rem auto;
        padding: 0 1rem;
      }
      .gradient-text {
        font-size: 2.2rem;
      }
      .sitemap-hero {
        margin-bottom: 2rem;
      }
      .sitemap-intro {
        font-size: 1rem;
      }
      .sitemap-controls {
        padding: 1.25rem;
        margin-bottom: 2rem;
        gap: 1rem;
      }
      .category-title {
        font-size: 1.45rem;
        margin-bottom: 1.25rem;
      }
      .calc-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .calc-card {
        padding: 1.25rem;
        min-height: auto;
      }
      .tab-btn {
        padding: 0.5rem 1rem;
        font-size: 0.88rem;
      }
      .category-tabs {
        gap: 0.5rem;
      }
    }
  `]
})
export class SitemapComponent {
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');

  financial: CalcEntry[] = [
    { name: 'Mortgage Calculator', link: '/financial/mortgage', desc: 'Calculate monthly mortgage payments and amortization schedule.', icon: 'Landmark' },
    { name: 'Car Loan EMI Calculator', link: '/financial/car-loan-emi-calculator', desc: 'Calculate your monthly car loan payments (EMI) and see a breakdown of principal and interest.', icon: 'Car' },
    { name: 'Lumpsum Calculator', link: '/financial/lumpsum-calculator', desc: 'Estimate maturity returns for your one-time wealth investments.', icon: 'Coins' },
    { name: 'Compound Interest Calculator', link: '/financial/compound-interest', desc: 'See how investments grow with compound interest.', icon: 'TrendingUp' },
    { name: 'GST Calculator', link: '/financial/gst-calculator', desc: 'Add or remove GST from any amount instantly.', icon: 'Receipt' },
    { name: 'SIP Calculator', link: '/financial/sip-calculator', desc: 'Estimate future value of Systematic Investment Plans.', icon: 'PiggyBank' },
    { name: 'Fixed Deposit Calculator', link: '/financial/fd-calculator', desc: 'Calculate FD maturity amount and interest earned.', icon: 'Vault' },
    { name: 'Income Tax Calculator', link: '/financial/tax-calculator', desc: 'Calculate income tax liability for FY 2024-25.', icon: 'FileText' },
    { name: 'Mutual Fund Returns Calculator', link: '/financial/mutual-fund-calculator', desc: 'Calculate absolute or XIRR returns on mutual funds.', icon: 'BarChart3' },
    { name: 'PPF Calculator', link: '/financial/ppf-calculator', desc: 'Estimate PPF maturity value after 15 years.', icon: 'BadgeCheck' },
    { name: 'Loan Eligibility Calculator', link: '/financial/loan-eligibility-calculator', desc: 'Find the maximum loan amount you qualify for.', icon: 'Building' },
    { name: 'Home Loan EMI Calculator', link: '/financial/home-loan-emi-calculator', desc: 'Calculate monthly home loan EMI.', icon: 'House' },
    { name: 'NPS Calculator', link: '/financial/nps-calculator', desc: 'Estimate pension and lumpsum withdrawal under the National Pension Scheme.', icon: 'Wallet' },
    { name: 'CAGR Calculator', link: '/financial/cagr-calculator', desc: 'Compute compound annual growth rate of investments over time.', icon: 'TrendingUp' },
    { name: 'Retirement Calculator', link: '/financial/retirement-calculator', desc: 'Plan retirement corpus based on expenses and returns.', icon: 'Calendar' },
    { name: 'Investment Calculator', link: '/financial/investment-calculator', desc: 'Calculate future value of investments.', icon: 'Coins' },
    { name: 'Bike Loan EMI Calculator', link: '/financial/bike-loan-emi-calculator', desc: 'Calculate two-wheeler loan EMI.', icon: 'Bike' },
    { name: 'Education Loan EMI Calculator', link: '/financial/education-loan-emi-calculator', desc: 'Calculate education loan EMI with moratorium.', icon: 'GraduationCap' },
  ];

  mathematical: CalcEntry[] = [
    { name: 'Percentage Calculator', link: '/mathematical/percentage-calculator', desc: 'Solve any percentage problem instantly.', icon: 'Percent' },
    { name: 'Scientific Calculator', link: '/mathematical/scientific-calculator', desc: 'Advanced scientific calculator with trig, log, and more.', icon: 'Calculator' },
    { name: 'Algebra Calculator', link: '/mathematical/algebra-calculator', desc: 'Solve equations and factor polynomials.', icon: 'SquareFunction' },
    { name: 'Matrix Calculator', link: '/mathematical/matrix-calculator', desc: 'Perform matrix addition, multiplication, and inversion.', icon: 'Grid2x2' },
    { name: 'Statistics Calculator', link: '/mathematical/statistics-calculator', desc: 'Calculate mean, median, mode, and standard deviation.', icon: 'Sigma' },
    { name: 'GPA Calculator', link: '/mathematical/gpa-calculator', desc: 'Calculate your semester or cumulative grade point average.', icon: 'GraduationCap' },
    { name: 'Fraction Calculator', link: '/mathematical/fraction-calculator', desc: 'Add, subtract, multiply, and divide fractions easily.', icon: 'Divide' },
  ];

  health: CalcEntry[] = [
    { name: 'Calorie Calculator (TDEE)', link: '/health/calorie-calculator', desc: 'Find daily calorie needs for your fitness goals.', icon: 'Flame' },
    { name: 'BMI Calculator', link: '/health/bmi-calculator', desc: 'Calculate Body Mass Index from height and weight.', icon: 'Scale' },
    { name: 'Body Fat Calculator', link: '/health/body-fat-calculator', desc: 'Estimate body fat percentage using body measurements.', icon: 'Target' },
    { name: 'Ideal Weight Calculator', link: '/health/ideal-weight-calculator', desc: 'Find your ideal healthy weight range.', icon: 'Heart' },
    { name: 'BMR TDEE Calculator', link: '/health/bmr-tdee-calculator', desc: 'Calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).', icon: 'Activity' },
    { name: 'Pregnancy Due Date Calculator', link: '/health/pregnancy-calculator', desc: 'Calculate your estimated due date, trimester, and milestones.', icon: 'Baby' },
    { name: 'Ovulation Calculator', link: '/health/ovulation-calculator', desc: 'Track your fertile window and ovulation date cycles.', icon: 'CalendarDays' },
  ];

  market: CalcEntry[] = [
    { name: 'Currency Converter', link: '/market/currency-converter', desc: 'Convert between 150+ currencies instantly with real-time exchange rates.', icon: 'Coins' },
    { name: 'Crypto Calculator', link: '/market/crypto-calculator', desc: 'Calculate cryptocurrency conversions for Bitcoin, Ethereum, and more.', icon: 'Bitcoin' },
    { name: 'Gold & Silver Calculator', link: '/market/gold-silver-calculator', desc: 'Calculate gold and silver rates based on live spot rates.', icon: 'Gem' },
  ];

  utility: CalcEntry[] = [
    { name: 'Age Calculator', link: '/utility/age-calculator', desc: 'Find your exact age in years, months, weeks, and days.', icon: 'Calendar' },
    { name: 'Hours Calculator', link: '/utility/hours-calculator', desc: 'Sum work hours, track timesheets, and calculate total pay.', icon: 'Clock' },
  ];

  categories = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    const filterList = (list: CalcEntry[]) => {
      if (!query) return list;
      return list.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query)
      );
    };

    const fin = filterList(this.financial);
    const math = filterList(this.mathematical);
    const hlth = filterList(this.health);
    const mkt = filterList(this.market);
    const utl = filterList(this.utility);

    const result = [];
    if (cat === 'all' || cat === 'financial') {
      if (fin.length > 0) result.push({ title: 'Financial Calculators', items: fin, key: 'financial' });
    }
    if (cat === 'all' || cat === 'mathematical') {
      if (math.length > 0) result.push({ title: 'Mathematical Calculators', items: math, key: 'mathematical' });
    }
    if (cat === 'all' || cat === 'health') {
      if (hlth.length > 0) result.push({ title: 'Health & Fitness Calculators', items: hlth, key: 'health' });
    }
    if (cat === 'all' || cat === 'market') {
      if (mkt.length > 0) result.push({ title: 'Market & Exchange Rate Calculators', items: mkt, key: 'market' });
    }
    if (cat === 'all' || cat === 'utility') {
      if (utl.length > 0) result.push({ title: 'Utility Calculators', items: utl, key: 'utility' });
    }
    return result;
  });
}
