import { ChangeDetectionStrategy, Component, OnInit, signal, computed, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, inject, PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { RouterLink } from '@angular/router';

import { LucideAngularModule } from 'lucide-angular';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface CalculatorCard {
  icon: string;
  title: string;
  description: string;
  link: string;
  category: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, LucideAngularModule, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calculatorsSection') calculatorsSection!: ElementRef;
  private platformId = inject(PLATFORM_ID);
  private ctx!: gsap.Context;

  public seoActiveTab = 'finance';

  swiperBreakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 16
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 24
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 24
    }
  };

  calculatorCards = signal<CalculatorCard[]>([
    { icon: 'house', title: 'Mortgage Calculator', description: 'Calculate your monthly mortgage payments and amortization schedule.', link: '/financial/mortgage', category: 'Financial' },
    { icon: 'car', title: 'Car Loan EMI Calculator', description: 'Calculate your monthly car loan payments (EMI) with principal and interest breakdown.', link: '/financial/car-loan-emi-calculator', category: 'Financial' },
    { icon: 'coins', title: 'Lumpsum Calculator', description: 'Estimate maturity returns for your one-time wealth investments.', link: '/financial/lumpsum-calculator', category: 'Financial' },
    { icon: 'trending-up', title: 'Compound Interest', description: 'See how your investments grow over time with compound interest.', link: '/financial/compound-interest', category: 'Financial' },
    { icon: 'receipt', title: 'GST Calculator', description: 'Quickly add or remove GST from any amount.', link: '/financial/gst-calculator', category: 'Financial' },
    { icon: 'piggy-bank', title: 'SIP Calculator', description: 'Estimate the future value of your Systematic Investment Plans.', link: '/financial/sip-calculator', category: 'Financial' },
    { icon: 'bar-chart-3', title: 'Mutual Fund Returns Calculator', description: 'Helps you calculate the absolute or annualized (XIRR) returns on your existing mutual fund investments.', link: '/financial/mutual-fund-calculator', category: 'Financial' },
    { icon: 'landmark', title: 'Fixed Deposit Calculator', description: 'Calculates the maturity amount and interest you earn on a fixed deposit.', link: '/financial/fd-calculator', category: 'Financial' },
    { icon: 'vault', title: 'PPF (Public Provident Fund) Calculator', description: 'Estimates the maturity value of your PPF account, which has a 15-year lock-in period.', link: '/financial/ppf-calculator', category: 'Financial' },
    { icon: 'file-text', title: 'Income Tax Calculator', description: 'Determine your annual tax liability and effective tax rate.', link: '/financial/tax-calculator', category: 'Financial' },
    { icon: 'badge-check', title: 'Loan Eligibility / Affordability Calculator', description: 'Estimates the maximum loan amount you are likely to be approved for based on your income and existing debts.', link: '/financial/loan-eligibility-calculator', category: 'Financial' },
    { icon: 'building', title: 'Home Loan EMI Calculator', description: 'Calculate your monthly home loan payments (EMI) and see a breakdown of principal and interest.', link: '/financial/home-loan-emi-calculator', category: 'Financial' },
    { icon: 'wallet', title: 'NPS Calculator', description: 'Estimate your pension and lumpsum withdrawal under the National Pension Scheme.', link: '/financial/nps-calculator', category: 'Financial' },
    { icon: 'trending-up', title: 'CAGR Calculator', description: 'Compute compound annual growth rate of investments over time.', link: '/financial/cagr-calculator', category: 'Financial' },
    { icon: 'percent', title: 'Percentage Calculator', description: 'Solve various percentage problems instantly.', link: '/mathematical/percentage-calculator', category: 'Mathematical' },
    { icon: 'calculator', title: 'Scientific Calculator', description: 'Perform complex scientific and mathematical operations.', link: '/mathematical/scientific-calculator', category: 'Mathematical' },
    { icon: 'square-function', title: 'Algebra Calculator', description: 'Solve equations, factor polynomials, and graph inequalities.', link: '/mathematical/algebra-calculator', category: 'Mathematical' },
    { icon: 'grid-2x2', title: 'Matrix Calculator', description: 'Perform matrix operations, such as addition, subtraction, and multiplication.', link: '/mathematical/matrix-calculator', category: 'Mathematical' },
    { icon: 'sigma', title: 'Statistics Calculator', description: 'Calculate various statistics, such as mean, median, and mode.', link: '/mathematical/statistics-calculator', category: 'Mathematical' },
    { icon: 'graduation-cap', title: 'GPA Calculator', description: 'Calculate your semester or cumulative grade point average.', link: '/mathematical/gpa-calculator', category: 'Mathematical' },
    { icon: 'divide', title: 'Fraction Calculator', description: 'Add, subtract, multiply, and divide fractions easily.', link: '/mathematical/fraction-calculator', category: 'Mathematical' },
    { icon: 'activity', title: 'Calorie Calculator', description: 'Find your daily calorie needs for weight loss, gain, or maintenance.', link: '/health/calorie-calculator', category: 'Health & Fitness' },
    { icon: 'scale', title: 'BMI Calculator', description: 'Measure weight relative to height to categorize body mass index.', link: '/health/bmi-calculator', category: 'Health & Fitness' },
    { icon: 'user', title: 'Body Fat Calculator', description: 'Estimate fat percentage, lean body mass, and fat mass using body measurements.', link: '/health/body-fat-calculator', category: 'Health & Fitness' },
    { icon: 'target', title: 'Ideal Weight Calculator', description: 'Determine a target healthy weight range based on height, age, and gender.', link: '/health/ideal-weight-calculator', category: 'Health & Fitness' },
    { icon: 'baby', title: 'Pregnancy Due Date Calculator', description: 'Calculate your estimated due date, trimester, and milestones.', link: '/health/pregnancy-calculator', category: 'Health & Fitness' },
    { icon: 'calendar-days', title: 'Ovulation Calculator', description: 'Track your fertile window and ovulation date cycles.', link: '/health/ovulation-calculator', category: 'Health & Fitness' },
    { icon: 'coins', title: 'Currency Converter', description: 'Convert between 150+ fiat currencies with live, real-time exchange rates.', link: '/market/currency-converter', category: 'Markets & Rates' },
    { icon: 'bitcoin', title: 'Crypto Calculator', description: 'Estimate cryptocurrency swaps and transaction fee costs.', link: '/market/crypto-calculator', category: 'Markets & Rates' },
    { icon: 'gem', title: 'Gold & Silver Rate Calculator', description: 'Calculate live gold and silver prices with purity, weight, and GST taxes.', link: '/market/gold-silver-calculator', category: 'Markets & Rates' },
    { icon: 'calendar', title: 'Age Calculator', description: 'Find your exact age in years, months, weeks, and days.', link: '/utility/age-calculator', category: 'Utility' },
    { icon: 'clock', title: 'Hours Calculator', description: 'Sum work hours, track timesheets, and calculate total pay.', link: '/utility/hours-calculator', category: 'Utility' },
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

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          import('swiper/element/bundle').then(({ register }) => register());
        });
      } else {
        setTimeout(() => {
          import('swiper/element/bundle').then(({ register }) => register());
        }, 1500);
      }
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {
      // Parallax effect for hero background
      gsap.to('.hero-background', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      const splitTitle = new SplitText('.hero-title', { type: 'words,chars' });
      document.querySelector('.hero-title')?.removeAttribute('aria-label');
      gsap.from(splitTitle.chars, {
        opacity: 0,
        scale: 0,
        rotation: 360,
        ease: 'back.out(2)',
        stagger: 0.03,
        duration: 0.8,
        delay: 0.1,
      });

      const splitSubtitle = new SplitText('.hero-subtitle', { type: 'words' });
      document.querySelector('.hero-subtitle')?.removeAttribute('aria-label');
      gsap.from(splitSubtitle.words, {
        opacity: 0,
        y: 30,
        ease: 'power2.out',
        stagger: 0.1,
        duration: 0.8,
        delay: 0.3
      });

      // Add continuous float
      gsap.to(splitSubtitle.words, {
        y: -5,
        ease: 'sine.inOut',
        stagger: {
          each: 0.1,
          repeat: -1,
          yoyo: true
        },
        duration: 2,
        delay: 1.0
      });

      // Floating calculator icons
      gsap.to('.floating-icon', {
        y: -20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 3,
        stagger: {
          each: 0.5,
          from: 'random',
        },
      });

      // Calculator card stagger animation — immediateRender: false prevents
      // GSAP from setting opacity:0 before the trigger fires (fixes flash-of-invisible)
      gsap.from('.calculator-card', {
        opacity: 0,
        y: 50,
        stagger: 0.08,
        ease: 'power2.out',
        duration: 0.6,
        immediateRender: false,
        clearProps: 'all',
        scrollTrigger: {
          trigger: '.calculator-grid',
          start: 'top 80%',
        },
      });

      // Quick-access nav: slide down & fade in
      gsap.from('.quick-access-nav', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.3,
        clearProps: 'all',
      });

      // About section: slide up on scroll — immediateRender: false prevents
      // GSAP from setting opacity:0 before the section scrolls into view,
      // which was making the about section appear blank on initial load
      gsap.from('.about-text-block', {
        opacity: 0,
        x: -60,
        duration: 0.9,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '#about-section',
          start: 'top 75%',
        },
      });

      gsap.from('.about-stat-card', {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.7,
        ease: 'back.out(1.5)',
        immediateRender: false,
        clearProps: 'all',
        scrollTrigger: {
          trigger: '#about-section',
          start: 'top 70%',
          onEnter: () => this.animateCounters(),
        },
      });

      // Accent line width animation
      gsap.from('.about-accent-line', {
        scaleX: 0,
        duration: 0.8,
        ease: 'power3.out',
        immediateRender: false,
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: '#about-section',
          start: 'top 80%',
        },
      });
    });
  }

  ngOnDestroy() {
    if (this.ctx) {
      this.ctx.revert(); // Clean up GSAP animations and ScrollTriggers to prevent memory leaks and duplication on SPA navigation
    }
  }

  private animateCounters(): void {
    document.querySelectorAll<HTMLElement>('.stat-number').forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toString();
        },
      });
    });
  }

  scrollToCalculators() {
    this.calculatorsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
