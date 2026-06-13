import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

const BASE_URL = 'https://calculhub.in';

const calcSchema = (name: string, url: string, desc: string, category = 'FinanceApplication') => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name, url, description: desc,
  applicationCategory: category,
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
});

export const routes: Routes = [
  {
    path: '', component: HomeComponent, pathMatch: 'full',
    data: {
      title: 'CalculHub — Free Online Calculators for Finance, Health & Math',
      description: 'CalculHub offers 20+ free online calculators — BMI, EMI, GST, SIP, percentage and more. Fast, accurate, mobile-friendly. No login needed.',
      canonical: BASE_URL,
      breadcrumbs: [{ name: 'Home', url: BASE_URL }],
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'CalculHub',
          url: BASE_URL,
          description: 'CalculHub offers 20+ free online calculators for finance, health, and math.'
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'CalculHub',
          url: BASE_URL,
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'All',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR'
          }
        }
      ]
    }
  },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'financial',
    loadComponent: () => import('./financial/financial.component').then(m => m.FinancialComponent),
    children: [
      {
        path: 'mortgage',
        loadComponent: () => import('./Allcalculators/mortgage-calculator/mortgage-calculator').then(m => m.MortgageCalculator),
        data: {
          title: 'Mortgage Calculator — Calculate Monthly Home Loan Payments | CalculHub',
          description: 'Calculate your monthly mortgage EMI, total interest, and amortization schedule. Enter loan amount, tenure, and interest rate for instant results.',
          canonical: `${BASE_URL}/financial/mortgage`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'Mortgage Calculator', url: `${BASE_URL}/financial/mortgage` }],
          schema: [calcSchema('Mortgage Calculator', `${BASE_URL}/financial/mortgage`, 'Free online mortgage calculator. Calculate EMI, total interest, and amortization schedule.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What is PMI?', acceptedAnswer: { '@type': 'Answer', text: "Private Mortgage Insurance (PMI) is usually required by lenders if your down payment is less than 20% of the home's purchase price. It protects the lender if you default." } }
              ]
            }]
        }
      },
      {
        path: 'compound-interest',
        loadComponent: () => import('./Allcalculators/compound-interest-calculator/compound-interest-calculator').then(m => m.CompoundInterestCalculatorComponent),
        data: {
          title: 'Compound Interest Calculator — Calculate Investment Growth | CalculHub',
          description: 'See how your investments grow with compound interest. Enter principal, rate, and tenure to calculate maturity amount and total interest earned.',
          canonical: `${BASE_URL}/financial/compound-interest`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'Compound Interest Calculator', url: `${BASE_URL}/financial/compound-interest` }],
          schema: [calcSchema('Compound Interest Calculator', `${BASE_URL}/financial/compound-interest`, 'Calculate compound interest and investment growth over time.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'How does compounding frequency affect returns?', acceptedAnswer: { '@type': 'Answer', text: 'The more frequently interest is compounded (e.g., daily vs. annually), the faster your money grows, because you earn interest on your interest sooner.' } }
              ]
            }]
        }
      },
      {
        path: 'gst-calculator',
        loadComponent: () => import('./Allcalculators/gst-calculator/gst-calculator.component').then(m => m.GstCalculatorComponent),
        data: {
          title: 'GST Calculator — Add or Remove GST from Any Amount | CalculHub',
          description: 'Calculate GST amount and net price instantly. Add or remove 5%, 12%, 18%, or 28% GST from any amount. Free online GST calculator for India.',
          canonical: `${BASE_URL}/financial/gst-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'GST Calculator', url: `${BASE_URL}/financial/gst-calculator` }],
          schema: [calcSchema('GST Calculator', `${BASE_URL}/financial/gst-calculator`, 'Add or remove GST from any amount instantly. Supports all GST slabs.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What are CGST and SGST?', acceptedAnswer: { '@type': 'Answer', text: 'For intra-state sales, the GST is divided equally into Central GST (CGST) and State GST (SGST). For inter-state sales, Integrated GST (IGST) applies.' } }
              ]
            }]
        }
      },
      {
        path: 'sip-calculator',
        loadComponent: () => import('./Allcalculators/sip-calculator/sip-calculator.component').then(m => m.SipCalculatorComponent),
        data: {
          title: 'SIP Calculator — Calculate SIP Returns & Maturity Amount | CalculHub',
          description: 'Estimate the future value of your Systematic Investment Plan (SIP). Enter monthly investment, expected return rate, and tenure for instant results.',
          canonical: `${BASE_URL}/financial/sip-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'SIP Calculator', url: `${BASE_URL}/financial/sip-calculator` }],
          schema: [calcSchema('SIP Calculator', `${BASE_URL}/financial/sip-calculator`, 'Calculate SIP returns and maturity amount for your mutual fund investments.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What is the benefit of SIP over Lumpsum?', acceptedAnswer: { '@type': 'Answer', text: 'SIP allows you to start investing with small amounts. It also provides the benefit of Rupee Cost Averaging, meaning you buy more units when markets are low and fewer when markets are high, reducing overall risk.' } }
              ]
            }]
        }
      },
      {
        path: 'fd-calculator',
        loadComponent: () => import('./Allcalculators/fd-calculator/fd-calculator').then(m => m.FdCalculatorComponent),
        data: {
          title: 'FD Calculator — Calculate Fixed Deposit Maturity Amount | CalculHub',
          description: 'Calculate Fixed Deposit maturity amount and interest earned. Enter principal, interest rate, and tenure to see your FD returns instantly.',
          canonical: `${BASE_URL}/financial/fd-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'FD Calculator', url: `${BASE_URL}/financial/fd-calculator` }],
          schema: [calcSchema('Fixed Deposit Calculator', `${BASE_URL}/financial/fd-calculator`, 'Calculate FD maturity amount and total interest earned.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'Is FD interest taxable?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, the interest earned on Fixed Deposits is fully taxable according to your income tax slab, unless it is a specific tax-saving FD.' } }
              ]
            }]
        }
      },
      {
        path: 'tax-calculator',
        loadComponent: () => import('./Allcalculators/tax-calculator/tax-calculator').then(m => m.TaxCalculatorComponent),
        data: {
          title: 'Income Tax Calculator — Calculate Tax Liability for FY 2024-25 | CalculHub',
          description: 'Calculate your annual income tax liability under old and new tax regimes for FY 2024-25. Enter your income and deductions for instant tax calculation.',
          canonical: `${BASE_URL}/financial/tax-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'Income Tax Calculator', url: `${BASE_URL}/financial/tax-calculator` }],
          schema: [calcSchema('Income Tax Calculator', `${BASE_URL}/financial/tax-calculator`, 'Calculate income tax liability for FY 2024-25 under old and new regimes.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What is the difference between gross and net income?', acceptedAnswer: { '@type': 'Answer', text: 'Gross income is your total earnings before any taxes or deductions are removed. Net income (take-home pay) is what remains after all taxes and standard deductions have been subtracted.' } }
              ]
            }]
        }
      },
      {
        path: 'mutual-fund-calculator',
        loadComponent: () => import('./Allcalculators/mutual-fund-calculator/mutual-fund-calculator').then(m => m.MutualFundCalculatorComponent),
        data: {
          title: 'Mutual Fund Returns Calculator — Calculate XIRR & Absolute Returns | CalculHub',
          description: 'Calculate absolute and annualized (XIRR) returns on your mutual fund investments. Enter investment amount, current value, and period for instant results.',
          canonical: `${BASE_URL}/financial/mutual-fund-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'Mutual Fund Calculator', url: `${BASE_URL}/financial/mutual-fund-calculator` }],
          schema: [calcSchema('Mutual Fund Returns Calculator', `${BASE_URL}/financial/mutual-fund-calculator`, 'Calculate absolute and XIRR returns on mutual fund investments.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What return rate should I expect?', acceptedAnswer: { '@type': 'Answer', text: 'Equity mutual funds historically return between 10-14% annually over the long term, while debt funds return around 6-8%. Returns are not guaranteed and are subject to market risks.' } }
              ]
            }]
        }
      },
      {
        path: 'ppf-calculator',
        loadComponent: () => import('./Allcalculators/ppf-calculator/ppf-calculator').then(m => m.PpfCalculatorComponent),
        data: {
          title: 'PPF Calculator — Calculate Public Provident Fund Maturity | CalculHub',
          description: 'Calculate PPF maturity amount, yearly interest, and total corpus after 15 years. Free PPF calculator for India with current 7.1% interest rate.',
          canonical: `${BASE_URL}/financial/ppf-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'PPF Calculator', url: `${BASE_URL}/financial/ppf-calculator` }],
          schema: [calcSchema('PPF Calculator', `${BASE_URL}/financial/ppf-calculator`, 'Calculate PPF maturity amount and total corpus for 15-year lock-in period.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'Is PPF completely tax-free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, PPF falls under the EEE (Exempt-Exempt-Exempt) category. The invested amount, the interest earned, and the maturity amount are all exempt from income tax.' } }
              ]
            }]
        }
      },
      {
        path: 'loan-eligibility-calculator',
        loadComponent: () => import('./Allcalculators/loan-eligibility-calculator/loan-eligibility-calculator').then(m => m.LoanEligibilityCalculatorComponent),
        data: {
          title: 'Loan Eligibility Calculator — Check Maximum Loan Amount | CalculHub',
          description: 'Check how much loan you are eligible for based on your income and existing EMIs. Free loan eligibility calculator for home, car, and personal loans.',
          canonical: `${BASE_URL}/financial/loan-eligibility-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'Loan Eligibility Calculator', url: `${BASE_URL}/financial/loan-eligibility-calculator` }],
          schema: [calcSchema('Loan Eligibility Calculator', `${BASE_URL}/financial/loan-eligibility-calculator`, 'Calculate maximum loan eligibility based on income and existing obligations.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What is a good FOIR ratio?', acceptedAnswer: { '@type': 'Answer', text: 'Most banks prefer your total monthly EMI obligations (including the new loan) to be under 40% to 50% of your net monthly income.' } }
              ]
            }]
        }
      },
      {
        path: 'home-loan-emi-calculator',
        loadComponent: () => import('./Allcalculators/home-loan-emi-calculator/home-loan-emi-calculator').then(m => m.HomeLoanEmiCalculatorComponent),
        data: {
          title: 'Home Loan EMI Calculator — Calculate Monthly Housing Loan EMI | CalculHub',
          description: 'Calculate your home loan EMI instantly. Enter loan amount, interest rate, and tenure to see monthly EMI, total interest, and repayment schedule.',
          canonical: `${BASE_URL}/financial/home-loan-emi-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'Home Loan EMI Calculator', url: `${BASE_URL}/financial/home-loan-emi-calculator` }],
          schema: [calcSchema('Home Loan EMI Calculator', `${BASE_URL}/financial/home-loan-emi-calculator`, 'Calculate monthly home loan EMI, total interest, and repayment schedule.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'Can home loan EMI change over time?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, if you choose a floating interest rate, your EMI or tenure will change whenever the central bank adjusts benchmark repo rates.' } },
                { '@type': 'Question', name: 'Does early repayment reduce the EMI?', acceptedAnswer: { '@type': 'Answer', text: 'Making partial prepayments usually reduces your outstanding principal, which allows you to either lower your future EMIs or reduce your loan tenure.' } }
              ]
            }]
        }
      },
      {
        path: 'retirement-calculator',
        loadComponent: () => import('./Allcalculators/retirement-calculator/retirement-calculator').then(m => m.RetirementCalculatorComponent),
        data: {
          title: 'Retirement Calculator — Plan Your Retirement Corpus | CalculHub',
          description: 'Plan your retirement by calculating the required corpus based on monthly expenses, inflation, and expected returns. Free retirement planning calculator.',
          canonical: `${BASE_URL}/financial/retirement-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'Retirement Calculator', url: `${BASE_URL}/financial/retirement-calculator` }],
          schema: [calcSchema('Retirement Calculator', `${BASE_URL}/financial/retirement-calculator`, 'Calculate required retirement corpus based on expenses, inflation, and returns.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'Why is inflation important in retirement planning?', acceptedAnswer: { '@type': 'Answer', text: 'Inflation erodes purchasing power. An expense of ₹50,000 today might cost over ₹1.5 Lakhs in 20 years. A good retirement plan must account for the rising cost of living.' } }
              ]
            }]
        }
      },
      {
        path: 'investment-calculator',
        loadComponent: () => import('./Allcalculators/investment-calculator/investment-calculator').then(m => m.InvestmentCalculatorComponent),
        data: {
          title: 'Investment Calculator — Calculate Future Value of Investments | CalculHub',
          description: 'Calculate the future value of your investments with lump sum and monthly contributions. See growth projections with different return rates.',
          canonical: `${BASE_URL}/financial/investment-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'Investment Calculator', url: `${BASE_URL}/financial/investment-calculator` }],
          schema: [calcSchema('Investment Calculator', `${BASE_URL}/financial/investment-calculator`, 'Calculate future value of investments with lump sum and monthly contributions.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'Why is regular contribution important?', acceptedAnswer: { '@type': 'Answer', text: 'Regular contributions combined with compound interest drastically accelerate wealth creation. Consistent investing (dollar-cost averaging) also reduces market timing risk.' } }
              ]
            }]
        }
      },
      {
        path: 'bike-loan-emi-calculator',
        loadComponent: () => import('./Allcalculators/bike-loan-emi-calculator/bike-loan-emi-calculator').then(m => m.BikeLoanEmiCalculatorComponent),
        data: {
          title: 'Bike Loan EMI Calculator — Calculate Two-Wheeler Loan EMI | CalculHub',
          description: 'Calculate your bike or two-wheeler loan EMI. Enter loan amount, interest rate, and tenure to see monthly payments and total interest.',
          canonical: `${BASE_URL}/financial/bike-loan-emi-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'Bike Loan EMI Calculator', url: `${BASE_URL}/financial/bike-loan-emi-calculator` }],
          schema: [calcSchema('Bike Loan EMI Calculator', `${BASE_URL}/financial/bike-loan-emi-calculator`, 'Calculate two-wheeler loan EMI, total interest, and repayment schedule.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'Are processing fees included in the EMI?', acceptedAnswer: { '@type': 'Answer', text: 'No, processing fees are usually deducted upfront from the disbursed loan amount and are not part of the standard EMI calculation.' } }
              ]
            }]
        }
      },
      {
        path: 'education-loan-emi-calculator',
        loadComponent: () => import('./Allcalculators/education-loan-emi-calculator/education-loan-emi-calculator').then(m => m.EducationLoanEmiCalculatorComponent),
        data: {
          title: 'Education Loan EMI Calculator — Calculate Student Loan Payments | CalculHub',
          description: 'Calculate education loan EMI including the moratorium period. Plan your student loan repayment with this free education loan calculator.',
          canonical: `${BASE_URL}/financial/education-loan-emi-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Financial', url: `${BASE_URL}/financial` }, { name: 'Education Loan EMI Calculator', url: `${BASE_URL}/financial/education-loan-emi-calculator` }],
          schema: [calcSchema('Education Loan EMI Calculator', `${BASE_URL}/financial/education-loan-emi-calculator`, 'Calculate education loan EMI including moratorium period for student loan planning.'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What is a moratorium period?', acceptedAnswer: { '@type': 'Answer', text: 'A moratorium is a "repayment holiday" typically spanning the duration of your course plus 6 months or 1 year, during which you are not required to pay EMIs, though simple interest may still accrue.' } }
              ]
            }]
        }
      },
      { path: '', redirectTo: 'mortgage', pathMatch: 'full' },
    ],
  },
  {
    path: 'mathematical',
    loadComponent: () => import('./mathematical/mathematical').then(m => m.MathematicalComponent),
    children: [
      {
        path: 'percentage-calculator',
        loadComponent: () => import('./Allcalculators/percentage-calculator/percentage-calculator').then(m => m.PercentageCalculatorComponent),
        data: {
          title: 'Percentage Calculator — Find Percentage of Any Number | CalculHub',
          description: 'Solve any percentage problem instantly — find what percent of a number is, percentage increase/decrease, and reverse percentage calculations.',
          canonical: `${BASE_URL}/mathematical/percentage-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Mathematical', url: `${BASE_URL}/mathematical` }, { name: 'Percentage Calculator', url: `${BASE_URL}/mathematical/percentage-calculator` }],
          schema: [calcSchema('Percentage Calculator', `${BASE_URL}/mathematical/percentage-calculator`, 'Solve percentage problems, find percentage of numbers, and calculate percentage changes.', 'EducationalApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'How do I calculate a percentage discount?', acceptedAnswer: { '@type': 'Answer', text: 'To find the sale price, calculate the discount amount (Discount% × Original Price) and subtract it from the original price.' } }
              ]
            }]
        }
      },
      {
        path: 'scientific-calculator',
        loadComponent: () => import('./Allcalculators/scientific-calculator/scientific-calculator').then(m => m.ScientificCalculatorComponent),
        data: {
          title: 'Scientific Calculator Online — Trigonometry, Logarithms & More | CalculHub',
          description: 'Free online scientific calculator with trigonometric functions, logarithms, powers, roots, and more. Perfect for students and professionals.',
          canonical: `${BASE_URL}/mathematical/scientific-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Mathematical', url: `${BASE_URL}/mathematical` }, { name: 'Scientific Calculator', url: `${BASE_URL}/mathematical/scientific-calculator` }],
          schema: [calcSchema('Scientific Calculator', `${BASE_URL}/mathematical/scientific-calculator`, 'Online scientific calculator with trigonometry, logarithms, and advanced math functions.', 'EducationalApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: "What's the difference between a basic and scientific calculator?", acceptedAnswer: { '@type': 'Answer', text: 'Basic calculators handle simple arithmetic (addition, subtraction, multiplication, division). Scientific calculators can handle powers, roots, trigonometric functions, and logarithmic functions.' } }
              ]
            }]
        }
      },
      {
        path: 'algebra-calculator',
        loadComponent: () => import('./Allcalculators/algebra-calculator/algebra-calculator.component').then(m => m.AlgebraCalculatorComponent),
        data: {
          title: 'Algebra Calculator — Solve Equations & Factor Polynomials | CalculHub',
          description: 'Solve algebraic equations, factor polynomials, and simplify expressions step by step. Free online algebra calculator for students.',
          canonical: `${BASE_URL}/mathematical/algebra-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Mathematical', url: `${BASE_URL}/mathematical` }, { name: 'Algebra Calculator', url: `${BASE_URL}/mathematical/algebra-calculator` }],
          schema: [calcSchema('Algebra Calculator', `${BASE_URL}/mathematical/algebra-calculator`, 'Solve algebraic equations, factor polynomials, and simplify math expressions.', 'EducationalApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'Can it solve quadratic equations?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, by entering an equation in the form ax² + bx + c = 0, the calculator can find the roots for x.' } }
              ]
            }]
        }
      },
      {
        path: 'matrix-calculator',
        loadComponent: () => import('./Allcalculators/matrix-calculator/matrix-calculator').then(m => m.MatrixCalculatorComponent),
        data: {
          title: 'Matrix Calculator — Add, Subtract, Multiply Matrices Online | CalculHub',
          description: 'Perform matrix operations online — addition, subtraction, multiplication, determinant, inverse, and transpose. Free matrix calculator for linear algebra.',
          canonical: `${BASE_URL}/mathematical/matrix-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Mathematical', url: `${BASE_URL}/mathematical` }, { name: 'Matrix Calculator', url: `${BASE_URL}/mathematical/matrix-calculator` }],
          schema: [calcSchema('Matrix Calculator', `${BASE_URL}/mathematical/matrix-calculator`, 'Perform matrix operations including addition, multiplication, determinant and inverse.', 'EducationalApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: "Why can't I multiply certain matrices?", acceptedAnswer: { '@type': 'Answer', text: 'Matrix multiplication is only possible when the number of columns in the first matrix equals the number of rows in the second matrix (e.g., a 2×3 matrix can be multiplied by a 3×2 matrix).' } }
              ]
            }]
        }
      },
      {
        path: 'statistics-calculator',
        loadComponent: () => import('./Allcalculators/statistics-calculator/statistics-calculator').then(m => m.StatisticsCalculator),
        data: {
          title: 'Statistics Calculator — Mean, Median, Mode, Standard Deviation | CalculHub',
          description: 'Calculate mean, median, mode, standard deviation, variance, and more. Free online statistics calculator for data analysis.',
          canonical: `${BASE_URL}/mathematical/statistics-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Mathematical', url: `${BASE_URL}/mathematical` }, { name: 'Statistics Calculator', url: `${BASE_URL}/mathematical/statistics-calculator` }],
          schema: [calcSchema('Statistics Calculator', `${BASE_URL}/mathematical/statistics-calculator`, 'Calculate mean, median, mode, standard deviation, and variance for any dataset.', 'EducationalApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What is the difference between sample and population standard deviation?', acceptedAnswer: { '@type': 'Answer', text: 'If your data includes every member of the group you are studying, use Population. If your data is only a small representative subset of the whole, use Sample (which uses n-1 in the denominator to correct for bias).' } }
              ]
            }]
        }
      },
      { path: '', redirectTo: 'percentage-calculator', pathMatch: 'full' },
    ],
  },
  {
    path: 'health',
    loadComponent: () => import('./health/health.component').then(m => m.HealthComponent),
    children: [
      {
        path: 'calorie-calculator',
        loadComponent: () => import('./Allcalculators/calorie-calculator/calorie-calculator').then(m => m.CalorieCalculatorComponent),
        data: {
          title: 'Calorie Calculator — Find Your Daily Calorie Needs (TDEE) | CalculHub',
          description: 'Calculate your Total Daily Energy Expenditure (TDEE) and daily calorie needs for weight loss, maintenance, or muscle gain based on age, weight, height, and activity level.',
          canonical: `${BASE_URL}/health/calorie-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Health', url: `${BASE_URL}/health` }, { name: 'Calorie Calculator', url: `${BASE_URL}/health/calorie-calculator` }],
          schema: [calcSchema('Calorie Calculator', `${BASE_URL}/health/calorie-calculator`, 'Calculate daily calorie needs (TDEE) for weight loss, maintenance, or muscle gain.', 'HealthApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'How many calories should I eat to lose weight?', acceptedAnswer: { '@type': 'Answer', text: 'A general rule is to eat 500 calories less than your maintenance level to lose about 0.5 kg (1 lb) per week safely.' } },
                { '@type': 'Question', name: 'Should I eat back calories burned through exercise?', acceptedAnswer: { '@type': 'Answer', text: "If you accurately included your exercise in the 'activity level' dropdown, do not eat them back, as they are already accounted for." } }
              ]
            }]
        }
      },
      {
        path: 'bmi-calculator',
        loadComponent: () => import('./Allcalculators/bmi-calculator/bmi-calculator').then(m => m.BmiCalculatorComponent),
        data: {
          title: 'BMI Calculator — Check Your Body Mass Index Free | CalculHub',
          description: 'Calculate your Body Mass Index (BMI) instantly. Enter height and weight to get your BMI score, category (underweight/normal/overweight/obese), and health insights.',
          canonical: `${BASE_URL}/health/bmi-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Health', url: `${BASE_URL}/health` }, { name: 'BMI Calculator', url: `${BASE_URL}/health/bmi-calculator` }],
          schema: [
            calcSchema('BMI Calculator', `${BASE_URL}/health/bmi-calculator`, 'Free online BMI calculator. Enter height and weight to instantly find your Body Mass Index and health category.', 'HealthApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What is a healthy BMI range?', acceptedAnswer: { '@type': 'Answer', text: 'A BMI between 18.5 and 24.9 is considered healthy for adults.' } },
                { '@type': 'Question', name: 'How is BMI calculated?', acceptedAnswer: { '@type': 'Answer', text: 'BMI = weight(kg) / height(m)². Divide your weight in kilograms by your height in metres squared.' } },
              ]
            }
          ]
        }
      },
      {
        path: 'body-fat-calculator',
        loadComponent: () => import('./Allcalculators/body-fat-calculator/body-fat-calculator').then(m => m.BodyFatCalculatorComponent),
        data: {
          title: 'Body Fat Calculator — Estimate Body Fat Percentage | CalculHub',
          description: 'Estimate your body fat percentage using body measurements. Calculate lean body mass and fat mass using the US Navy formula. Free body fat calculator.',
          canonical: `${BASE_URL}/health/body-fat-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Health', url: `${BASE_URL}/health` }, { name: 'Body Fat Calculator', url: `${BASE_URL}/health/body-fat-calculator` }],
          schema: [calcSchema('Body Fat Calculator', `${BASE_URL}/health/body-fat-calculator`, 'Estimate body fat percentage, lean body mass, and fat mass using body measurements.', 'HealthApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What is a healthy body fat percentage?', acceptedAnswer: { '@type': 'Answer', text: 'A healthy range for men is generally 10-20%, and for women 20-30%, depending on age.' } },
                { '@type': 'Question', name: 'Is the U.S. Navy method accurate?', acceptedAnswer: { '@type': 'Answer', text: 'It provides a good estimate (within 3-4% of DEXA scans) but may overestimate fat in highly muscular individuals.' } }
              ]
            }]
        }
      },
      {
        path: 'ideal-weight-calculator',
        loadComponent: () => import('./Allcalculators/ideal-weight-calculator/ideal-weight-calculator').then(m => m.IdealWeightCalculatorComponent),
        data: {
          title: 'Ideal Weight Calculator — Find Your Healthy Weight Range | CalculHub',
          description: 'Calculate your ideal body weight range based on height, age, and gender. Uses multiple formulas (Hamwi, Devine, Robinson) for accurate results.',
          canonical: `${BASE_URL}/health/ideal-weight-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Health', url: `${BASE_URL}/health` }, { name: 'Ideal Weight Calculator', url: `${BASE_URL}/health/ideal-weight-calculator` }],
          schema: [calcSchema('Ideal Weight Calculator', `${BASE_URL}/health/ideal-weight-calculator`, 'Determine ideal body weight range using Hamwi, Devine, and Robinson formulas.', 'HealthApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'Which ideal weight formula is the best?', acceptedAnswer: { '@type': 'Answer', text: "No single formula is perfect. The Devine formula is the most widely used in medical settings, but it's best to look at the average or range of all formulas provided." } },
                { '@type': 'Question', name: 'Does ideal weight account for muscle mass?', acceptedAnswer: { '@type': 'Answer', text: "No, these formulas do not account for body composition (muscle vs. fat). Athletes may weigh more than their 'ideal' weight but still be perfectly healthy." } }
              ]
            }]
        }
      },
      {
        path: 'bmr-tdee-calculator',
        loadComponent: () => import('./Allcalculators/bmr-tdee-calculator/bmr-tdee-calculator').then(m => m.BmrTdeeCalculatorComponent),
        data: {
          title: 'BMR TDEE Calculator — Calculate BMR & Daily Calorie Needs | CalculHub',
          description: 'Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE). Find your daily calorie needs for weight management.',
          canonical: `${BASE_URL}/health/bmr-tdee-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Health', url: `${BASE_URL}/health` }, { name: 'BMR TDEE Calculator', url: `${BASE_URL}/health/bmr-tdee-calculator` }],
          schema: [calcSchema('BMR TDEE Calculator', `${BASE_URL}/health/bmr-tdee-calculator`, 'Calculate your BMR and TDEE based on physical details and activity level.', 'HealthApplication')]
        }
      },
      { path: '', redirectTo: 'calorie-calculator', pathMatch: 'full' },
    ],
  },
  {
    path: 'market',
    loadComponent: () => import('./market/market').then(m => m.MarketComponent),
    children: [
      {
        path: 'currency-converter',
        loadComponent: () => import('./Allcalculators/currency-converter/currency-converter.component').then(m => m.CurrencyConverterComponent),
        data: {
          title: 'Currency Converter — Real-Time Exchange Rates | CalculHub',
          description: 'Convert between 150+ currencies instantly with real-time exchange rates. View live rates, comparison charts, and convert major fiat currencies.',
          canonical: `${BASE_URL}/market/currency-converter`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Markets & Rates', url: `${BASE_URL}/market` }, { name: 'Currency Converter', url: `${BASE_URL}/market/currency-converter` }],
          schema: [calcSchema('Currency Converter', `${BASE_URL}/market/currency-converter`, 'Convert 150+ fiat currencies with real-time exchange rates and historical comparison charts.', 'FinanceApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'How are exchange rates determined?', acceptedAnswer: { '@type': 'Answer', text: 'Exchange rates are determined by global foreign exchange markets where currencies are traded 24/7. These rates fluctuate based on supply, demand, inflation, and economic stability.' } }
              ]
            }]
        }
      },
      {
        path: 'crypto-calculator',
        loadComponent: () => import('./Allcalculators/crypto-calculator/crypto-calculator.component').then(m => m.CryptoCalculatorComponent),
        data: {
          title: 'Cryptocurrency Calculator & Exchange Rate Converter | CalculHub',
          description: 'Calculate cryptocurrency conversions for Bitcoin, Ethereum, Solana, and more. Estimate trade fees, buy/sell values, and payout amounts instantly.',
          canonical: `${BASE_URL}/market/crypto-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Markets & Rates', url: `${BASE_URL}/market` }, { name: 'Crypto Calculator', url: `${BASE_URL}/market/crypto-calculator` }],
          schema: [calcSchema('Crypto Calculator', `${BASE_URL}/market/crypto-calculator`, 'Convert between top cryptocurrencies and fiat currencies, with transaction fee estimation.', 'FinanceApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'How are cryptocurrency transaction fees calculated?', acceptedAnswer: { '@type': 'Answer', text: 'Crypto transaction fees depend on the network congestion and the exchange provider being used. This calculator allows you to input a custom percentage fee to estimate your net payout or total cost.' } }
              ]
            }]
        }
      },
      {
        path: 'gold-silver-calculator',
        loadComponent: () => import('./Allcalculators/gold-silver-calculator/gold-silver-calculator.component').then(m => m.GoldSilverCalculatorComponent),
        data: {
          title: 'Gold & Silver Rate Calculator — Live Spot Rates | CalculHub',
          description: 'Calculate gold and silver prices based on live spot rates, karat purity, custom weights, making charges, and local GST billing.',
          canonical: `${BASE_URL}/market/gold-silver-calculator`,
          breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Markets & Rates', url: `${BASE_URL}/market` }, { name: 'Gold & Silver Calculator', url: `${BASE_URL}/market/gold-silver-calculator` }],
          schema: [calcSchema('Gold & Silver Rate Calculator', `${BASE_URL}/market/gold-silver-calculator`, 'Determine current gold and silver rates with karat adjustments, making charges, and invoice tax breakdowns.', 'FinanceApplication'),
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What is Karat in gold?', acceptedAnswer: { '@type': 'Answer', text: 'Karat measures the purity of gold. 24K gold is 99.9% pure, 22K is 91.6% pure (standard for jewelry), 18K is 75% pure, and 14K is 58.3% pure.' } }
              ]
            }]
        }
      },
      { path: '', redirectTo: 'currency-converter', pathMatch: 'full' },
    ],
  },
  {
    path: 'other',
    loadComponent: () => import('./other/other.component').then(m => m.OtherComponent),
    data: {
      title: 'Other Calculators — Lifestyle & Everyday Tools | CalculHub',
      description: 'Discover unique lifestyle calculators on CalculHub — buy vs rent analysis, millionaire calculator, and more everyday tools.',
      canonical: `${BASE_URL}/other`,
    }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      title: 'About CalculHub — Free Online Calculators for Everyone',
      description: 'Learn about CalculHub — a free, ad-light calculator platform offering 20+ tools for finance, health, and mathematics. Built for accuracy, speed, and privacy.',
      canonical: `${BASE_URL}/about`,
      breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'About', url: `${BASE_URL}/about` }],
    }
  },
  {
    path: 'blog',
    loadComponent: () => import('./blog/blog.component').then(m => m.BlogComponent),
    data: {
      title: 'Blog — Financial Tips, Health Guides & Math Tricks | CalculHub',
      description: 'Read expert articles on personal finance, health metrics, and mathematical concepts. CalculHub blog helps you understand and use calculators better.',
      canonical: `${BASE_URL}/blog`,
    }
  },
  {
    path: 'sitemap',
    loadComponent: () => import('./sitemap/sitemap.component').then(m => m.SitemapComponent),
    data: {
      title: 'All Calculators — Site Directory | CalculHub',
      description: 'Complete directory of all free calculators on CalculHub — financial, mathematical, and health calculators organized by category.',
      canonical: `${BASE_URL}/sitemap`,
    }
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
    data: {
      title: 'Privacy Policy — How CalculHub Protects Your Data',
      description: 'CalculHub\'s privacy policy: zero server storage, no personal accounts, minimal cookies. All calculator inputs stay on your device. DPDP, GDPR, and CCPA compliant.',
      canonical: `${BASE_URL}/privacy-policy`,
      breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Privacy Policy', url: `${BASE_URL}/privacy-policy` }],
    }
  },
  {
    path: 'terms',
    loadComponent: () => import('./terms/terms.component').then(m => m.TermsComponent),
    data: {
      title: 'Terms & Conditions — CalculHub Disclaimer & Usage Policy',
      description: 'Terms of use for CalculHub. Includes an important YMYL disclaimer: all financial and health calculator results are estimates for informational purposes only and not professional advice.',
      canonical: `${BASE_URL}/terms`,
      breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Terms & Conditions', url: `${BASE_URL}/terms` }],
    }
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent),
    data: {
      title: 'Contact Us — Get Support & Send Feedback | CalculHub',
      description: 'Contact the CalculHub team for support, bug reports, or feature requests. Reach us at sameervirak@gmail.com. We typically respond within 24–48 hours.',
      canonical: `${BASE_URL}/contact`,
      breadcrumbs: [{ name: 'Home', url: BASE_URL }, { name: 'Contact', url: `${BASE_URL}/contact` }],
    }
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];