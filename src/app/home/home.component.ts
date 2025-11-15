
import { ChangeDetectionStrategy, Component, OnInit, signal, computed, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { RouterLink } from '@angular/router';
import { SwiperContainer } from 'swiper/element';
import { AlgebraCalculatorComponent } from '../Allcalculators/algebra-calculator/algebra-calculator.component';

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
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('calculatorsSection') calculatorsSection!: ElementRef;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;


  calculatorCards = signal<CalculatorCard[]>([
    { icon: '💰', title: 'Mortgage Calculator', description: 'Calculate your monthly mortgage payments and amortization schedule.', link: '/financial/mortgage', category: 'Financial' },
    { icon: '📈', title: 'Compound Interest', description: 'See how your investments grow over time with compound interest.', link: '/financial/compound-interest', category: 'Financial' },
    { icon: '🧾', title: 'GST Calculator', description: 'Quickly add or remove GST from any amount.', link: '/financial/gst-calculator', category: 'Financial' },
    { icon: '📊', title: 'SIP Calculator', description: 'Estimate the future value of your Systematic Investment Plans.', link: '/financial/sip-calculator', category: 'Financial' },
    { icon: '🎢', title: 'Mutual Fund Returns Calculator', description: 'Helps you calculate the absolute or annualized (XIRR) returns on your existing mutual fund investments.', link: '/financial/mutual-fund-calculator', category: 'Financial' },
    { icon: '🏦', title: 'Fixed Deposit Calculator', description: 'Calculates the maturity amount and interest you earn on a fixed deposit.', link: '/financial/fd-calculator', category: 'Financial' },
    { icon: '💶', title: 'PPF (Public Provident Fund) Calculator', description: 'Estimates the maturity value of your PPF account, which has a 15-year lock-in period.', link: '/financial/ppf-calculator', category: 'Financial' },
    { icon: '🪙', title: 'Income Tax Calculator', description: 'Determine your annual tax liability and effective tax rate.', link: '/financial/tax', category: 'Financial' },
    { icon: '🎫', title: 'Loan Eligibility / Affordability Calculator', description: 'Estimates the maximum loan amount you are likely to be approved for based on your income and existing debts.', link: '/financial/tax', category: 'Financial' },
    { icon: '🏠', title: 'Home Loan EMI Calculator', description: 'Calculate your monthly home loan payments (EMI) and see a breakdown of principal and interest.', link: '/financial/home-loan-emi-calculator', category: 'Financial' },
    { icon: '%', title: 'Percentage Calculator', description: 'Solve various percentage problems instantly.', link: '/mathematical/percentage', category: 'Mathematical' },
    { icon: '✖️', title: 'Scientific Calculator', description: 'Perform complex scientific and mathematical operations.', link: '/mathematical/scientific', category: 'Mathematical' },
    { icon: '🧮', title: 'Algebra Calculator', description: 'Solve equations, factor polynomials, and graph inequalities.', link: '/mathematical/algebra-calculator', category: 'Mathematical' },
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

  ngOnInit() {
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
    gsap.from(splitTitle.chars, {
      opacity: 0,
      scale: 0,
      rotation: 360,
      ease: 'back.out(2)',
      stagger: 0.03,
      duration: 0.8,
      delay: 0.5,
    });


    const splitSubtitle = new SplitText('.hero-subtitle', { type: 'words' });
    gsap.from(splitSubtitle.words, {
      opacity: 0,
      y: 30,
      ease: 'power2.out',
      stagger: 0.1,
      duration: 0.8,
      delay: 1.5
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
      delay: 2.5
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

    // Calculator card stagger animation
    gsap.from('.calculator-card', {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      ease: 'power2.out',
      duration: 0.8,
      scrollTrigger: {
        trigger: '.calculator-grid',
        start: 'top 80%',
        // scrub: true,
      },
    });
  }

  ngAfterViewInit() {
    if (this.swiperContainer) {
      const swiperParams = {
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 40
          }
        }
      };
      Object.assign(this.swiperContainer.nativeElement, swiperParams);
      this.swiperContainer.nativeElement.initialize();
    }
  }

  scrollToCalculators() {
    this.calculatorsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
