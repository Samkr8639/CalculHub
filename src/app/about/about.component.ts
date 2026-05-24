import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { DecimalPipe } from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-about',
  imports: [LucideAngularModule, DecimalPipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  // Navigation Tabs state
  public activeTab = signal<string>('vision');

  // FAQs state
  public activeFaq = signal<number | null>(null);
  public faqSearchQuery = signal<string>('');

  // Interactive Sandboxes State
  public activeSandbox = signal<'interest' | 'percentage'>('interest');

  // Compound Interest Sandbox State
  public sandboxPrincipal = signal<number>(100000);
  public sandboxRate = signal<number>(12);
  public sandboxYears = signal<number>(10);
  public sandboxCompoundFreq = signal<number>(1); // 1 = Annually, 4 = Quarterly, 12 = Monthly

  // Computed compound interest result
  public sandboxInterestResult = computed(() => {
    const P = this.sandboxPrincipal();
    const r = this.sandboxRate() / 100;
    const t = this.sandboxYears();
    const n = this.sandboxCompoundFreq();
    const total = P * Math.pow(1 + r / n, n * t);
    const interest = total - P;
    return {
      total: Math.round(total),
      interest: Math.round(interest)
    };
  });

  // Percentage Sandbox State
  public sandboxPercentVal = signal<number>(15);
  public sandboxNumVal = signal<number>(5000);

  // Computed percentage result
  public sandboxPercentResult = computed(() => {
    const p = this.sandboxPercentVal();
    const num = this.sandboxNumVal();
    return Math.round((p / 100) * num * 100) / 100;
  });

  // Timeline Milestone data
  public timelineEvents = signal<TimelineEvent[]>([
    {
      year: '2024 - Inception',
      title: 'The Blueprint & Concept',
      description: 'Frustrated by online utility tools that were slow, heavily laden with ads, and insecure, our founding developers envisioned a client-side calculator portal. The core objective was clear: extreme accuracy, high performance, and absolute data anonymity.',
      icon: 'Target'
    },
    {
      year: '2024 - Core Engines',
      title: 'Standalone Modular Framework',
      description: 'Built entirely on Angular standalone architecture, we engineered highly optimized math solvers, scientific calculation modules, and precise financial parsing algorithms that operate entirely in the client browser with zero latency.',
      icon: 'Cpu'
    },
    {
      year: '2025 - Financial Suite',
      title: 'Wealth & Amortization Mechanics',
      description: 'Developed advanced Indian banking standard math tools, including SIP (Systematic Investment Plan) calculators, Fixed Deposit (FD) compounders, Public Provident Fund (PPF) schedulers, and mortgage calculators featuring interactive amortization visualizer charts.',
      icon: 'PiggyBank'
    },
    {
      year: '2025 - Metabolic Science',
      title: 'Precision Health & Caloric Suites',
      description: 'Integrated robust clinical models, standardizing calculations for Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation, alongside body density calculations using the U.S. Navy tape-measurement standard.',
      icon: 'Activity'
    },
    {
      year: '2026 - Modernization',
      title: 'CalculHub Hub & Mobile Core',
      description: 'Unveiled CalculHub, consolidating all utilities under a unified site directory, powered by real-time search, responsive mobile drawer navigation, dynamic dark-theme visual components, and comprehensive search engine optimization.',
      icon: 'BadgeCheck'
    }
  ]);

  // Deep SEO-Optimized Knowledge Base / FAQs
  public faqItems = signal<FaqItem[]>([
    {
      question: 'How does CalculHub ensure 100% calculation accuracy across financial and medical modules?',
      answer: 'Our mathematical models undergo rigorous multi-phase verification. For financial calculations—such as EMI schedules, PPF, and Compound Interest—we implement standard banking formulas, including the time value of money (TVM) system. Every compounding schedule is computed step-by-step using precise floating-point decimal operations. For medical and fitness calculators, we leverage standard clinical formulas. For example, our BMR and TDEE suite utilizes the Mifflin-St Jeor equation—proven in clinical nutrition studies to be the most accurate predictor of metabolic rate. Our body fat index calculators adhere strictly to the U.S. Navy tape-measurement regression formula. By validating bounding limits on all inputs (e.g., verifying safe body mass indices and mathematical domains for logarithmic equations), we completely eliminate invalid states and computational failures.',
      category: 'Accuracy'
    },
    {
      question: 'Is my personal, financial, or physiological data stored on your servers?',
      answer: 'Absolutely not. Data security and absolute user privacy are the bedrock values of CalculHub. We operate under a strict serverless, client-side execution model. Unlike conventional calculation sites that stream your financial statistics or personal body tape parameters to remote database servers for processing, CalculHub performs 100% of its computation directly within your local browser. Because calculations happen inside your device\'s local memory environment, your proprietary data never traverses the internet, shielding it from intercept threats. For features that enhance user experience—such as saving calculation histories—we utilize your browser\'s local sandboxed memory via LocalStorage. This data stays securely on your device, and you can purge it at any time.',
      category: 'Privacy'
    },
    {
      question: 'What mathematical models power the dynamic Compound Interest and SIP investment tools?',
      answer: 'CalculHub\'s investment calculations are powered by the standard Future Value (FV) formula of ordinary annuities and compounding interest. The compounding mathematical model is expressed as: A = P(1 + r/n)^(n*t), where A represents the final future value, P is the initial principal investment, r is the nominal annual interest rate (expressed as a decimal), n represents the compounding frequency per year, and t is the term in years. For Systematic Investment Plans (SIPs), which are standard monthly contributions, the formula applied is: FV = P * [((1 + i)^n - 1) / i] * (1 + i), where P is the periodic contribution amount, i is the periodic interest rate, and n is the total number of periods. Our backend logic handles dynamic fractional conversions, auto-adjusts compounding periods (annual, semi-annual, quarterly, monthly, or daily), and outputs precise amortization breakdowns.',
      category: 'Finance'
    },
    {
      question: 'Why does CalculHub use client-side execution instead of server-side computation APIs?',
      answer: 'The decision to run calculations fully client-side is driven by three key engineering priorities: speed, scalability, and security. First, by offloading math solvers to your local browser run-time, we achieve near 0ms execution latency. There are no network request round-trips (HTTP POST/GET calls) slowing you down; the moment you modify a value, the outputs refresh instantly. Second, this model makes CalculHub infinitely scalable, allowing us to support millions of simultaneous users without server bottlenecks. Finally, it provides complete security. Your private data, from net worth projections to waist-to-hip physiological ratios, never leaves your machine, making CalculHub the most secure utility ecosystem on the web.',
      category: 'Technology'
    },
    {
      question: 'How is CalculHub optimized for accessibility (A11Y) and search engine crawling?',
      answer: 'CalculHub is engineered for inclusion. We strictly follow WCAG 2.1 Level AA accessibility standards, ensuring our interface works flawlessly for all users. This includes semantic HTML5 layouts, comprehensive keyboard navigability (full tab-indexing and focus rings), high color contrast ratios that exceed 4.5:1, and descriptive labels for screen-reader tools. For SEO optimization, we build structured heading outlines (H1-H6 hierarchy), semantic tag sets (like <article>, <section>, and <nav>), and optimized meta schema definitions. This allows search engines like Google to crawl and index our deep educational contents, providing maximum utility value and authority rankings.',
      category: 'SEO'
    },
    {
      question: 'What metabolic science equations are used for calorie and macro-nutrient calculations?',
      answer: 'Our health and calorie tools are built on modern metabolic research. We implement three distinct, highly validated mathematical models to estimate Basal Metabolic Rate (BMR): the Mifflin-St Jeor Formula, the Revised Harris-Benedict Equation, and the Katch-McArdle Formula. The Mifflin-St Jeor equation calculates BMR as: BMR = (10 * weight in kg) + (6.25 * height in cm) - (5 * age in years) + s, where s is +5 for males and -161 for females. For individuals who know their precise body fat composition, we recommend the Katch-McArdle formula, which calculates BMR based on lean body mass (LBM): BMR = 370 + (21.6 * LBM in kg). To determine your Total Daily Energy Expenditure (TDEE), we apply precise physical activity multipliers (ranging from sedentary at 1.2 to extremely active at 1.9) representing your daily metabolic activity load.',
      category: 'Health'
    }
  ]);

  // Computed list of filtered FAQs based on query
  public filteredFaqs = computed(() => {
    const query = this.faqSearchQuery().toLowerCase().trim();
    const faqs = this.faqItems();
    if (!query) {
      return faqs;
    }
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query)
    );
  });

  public setTab(tab: string) {
    this.activeTab.set(tab);
  }

  public setSandbox(type: 'interest' | 'percentage') {
    this.activeSandbox.set(type);
  }

  public toggleFaq(index: number) {
    this.activeFaq.update(curr => curr === index ? null : index);
  }

  public updateSearchQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    this.faqSearchQuery.set(input.value);
  }
}
