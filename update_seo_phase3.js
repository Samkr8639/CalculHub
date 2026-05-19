const fs = require('fs');
const path = require('path');

const calculators = {
  'bike-loan-emi-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Bike Loan EMI Calculator</h2>
    <p>A two-wheeler is a necessity for many, and financing it through a bike loan is a common approach. The Bike Loan EMI Calculator is a dedicated tool that helps prospective buyers calculate the Equated Monthly Installment (EMI) for their motorcycle or scooter loan. By providing clarity on the monthly financial commitment, this calculator ensures that buying your dream bike does not derail your monthly household budget.</p>
    <p>Interest rates on two-wheeler loans are typically higher than home or car loans because bikes are considered higher-risk, depreciating assets. Therefore, knowing exactly how much total interest you will pay over the tenure of the loan is critical. This calculator provides an instant amortization schedule, allowing you to balance the down payment, the loan amount, and the tenure to find the most cost-effective financing solution.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>Like most consumer loans, a bike loan EMI is calculated using the standard reducing balance amortization formula.</p>
    <div class="formula-box">
      EMI = [ P × r × (1 + r)^n ] / [ (1 + r)^n - 1 ]
    </div>
    <ul class="formula-vars">
      <li><strong>P:</strong> Principal loan amount (Cost of bike minus down payment).</li>
      <li><strong>r:</strong> Monthly interest rate (Annual Rate / 12 / 100).</li>
      <li><strong>n:</strong> Loan tenure in months (usually 12 to 60 months).</li>
    </ul>
    <p>Because bike loans have shorter tenures (typically 1 to 5 years), the interest burden is lower compared to long-term loans, but the monthly EMIs are relatively high. The formula clearly shows that increasing your down payment reduces 'P', which drastically lowers both your EMI and your total interest paid.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Down Payment Planning:</strong> Adjust the loan amount to see how saving for a slightly larger down payment can significantly reduce your monthly EMI.</li>
      <li><strong>Tenure Selection:</strong> Compare a 2-year loan against a 4-year loan to see the trade-off between higher monthly payments and paying less total interest to the bank.</li>
      <li><strong>Comparing Offers:</strong> Input different interest rates offered by various banks or dealerships to find the cheapest financing option.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What is the ideal tenure for a bike loan?</h3>
        <p>The ideal tenure is the shortest period you can comfortably afford the EMI. Most financial experts recommend keeping a bike loan tenure between 12 to 36 months. Since bikes depreciate quickly, a shorter loan ensures you do not end up paying more than the bike is worth in its later years.</p>
      </div>
      <div class="faq-item">
        <h3>Does the bank finance the on-road or ex-showroom price?</h3>
        <p>This depends on the lender. Some banks finance up to 100% of the ex-showroom price, meaning you pay for registration and insurance out of pocket. Others may finance up to 85% to 90% of the on-road price. Always check what the loan covers before finalizing the down payment.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/financial/home-loan-emi-calculator" class="related-calc-link">Home Loan EMI</a>
      <a href="/financial/loan-eligibility-calculator" class="related-calc-link">Loan Eligibility Calculator</a>
      <a href="/financial/education-loan-emi-calculator" class="related-calc-link">Education Loan EMI</a>
    </div>
  </div>
</div>
`,
  'education-loan-emi-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Education Loan EMI Calculator</h2>
    <p>Higher education is an invaluable investment, but it often requires substantial financial backing. An Education Loan EMI Calculator is specifically tailored to help students and parents plan the repayment of a student loan. Unlike standard loans, education loans come with a unique feature: a moratorium period (or holiday period), which is the duration of the course plus a grace period (usually 6 to 12 months) before the EMI repayment actually begins.</p>
    <p>During this moratorium period, simple interest continues to accrue on the disbursed amount. This calculator accurately factors in this accrued interest, adding it to the principal to determine the actual EMI that will start once the student secures employment. This transparency is crucial for young graduates stepping into the professional world.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>The calculation is a two-step process. First, the accrued interest during the moratorium period is calculated using Simple Interest. Then, the EMI is calculated on the new principal using the standard amortization formula.</p>
    <p><strong>Step 1: Moratorium Interest</strong></p>
    <div class="formula-box">
      Accrued Interest = Principal × Annual Rate × (Moratorium Period in Years)
    </div>
    <p><strong>Step 2: EMI Calculation</strong></p>
    <div class="formula-box">
      New Principal (P) = Original Principal + Accrued Interest<br>
      EMI = [ P × r × (1 + r)^n ] / [ (1 + r)^n - 1 ]
    </div>
    <ul class="formula-vars">
      <li><strong>r:</strong> Monthly interest rate.</li>
      <li><strong>n:</strong> Repayment tenure in months (excluding the moratorium period).</li>
    </ul>
    <p>Many banks offer a concession on the interest rate (typically 1%) if the accrued interest is paid during the moratorium period itself, which prevents the principal from ballooning.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Future Financial Planning:</strong> Understand exactly what your monthly liability will be once you graduate and secure a job.</li>
      <li><strong>Moratorium Payment Strategy:</strong> Calculate how much lower your future EMI will be if your parents decide to pay the simple interest during your course period rather than letting it accrue.</li>
      <li><strong>Choosing Loan Tenure:</strong> Most education loans offer repayment tenures up to 15 years. Use the tool to find a balance between a manageable starting EMI and total interest paid.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What is a moratorium period?</h3>
        <p>The moratorium period is a "repayment holiday" granted to students. It typically covers the entire duration of the academic course plus an additional 6 to 12 months, allowing the student time to graduate and find employment before the EMI repayments commence.</p>
      </div>
      <div class="faq-item">
        <h3>Are there tax benefits on an education loan?</h3>
        <p>Yes, under Section 80E of the Income Tax Act in India, the entire interest paid on an education loan is fully deductible from taxable income. There is no upper limit on the deduction amount, and this benefit is available for up to 8 consecutive years starting from the year repayment begins.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/financial/loan-eligibility-calculator" class="related-calc-link">Loan Eligibility Calculator</a>
      <a href="/financial/home-loan-emi-calculator" class="related-calc-link">Home Loan EMI</a>
      <a href="/financial/bike-loan-emi-calculator" class="related-calc-link">Bike Loan EMI</a>
    </div>
  </div>
</div>
`,
  'retirement-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Retirement Calculator</h2>
    <p>Retirement planning is arguably the most critical component of personal finance. A Retirement Calculator is a comprehensive predictive tool designed to estimate how much money you will need to maintain your current lifestyle after you stop working. It takes into account your current age, planned retirement age, life expectancy, current savings, expected inflation, and anticipated post-retirement investment returns.</p>
    <p>Inflation is the silent destroyer of purchasing power. What costs ₹50,000 a month today could cost over ₹1.5 Lakhs in 20 years. By factoring in these economic variables, this calculator bridges the gap between your current savings rate and your future financial needs, helping you determine exactly how much you need to invest every month starting today to build a sustainable, inflation-proof retirement corpus.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>Retirement calculations rely on complex time-value-of-money formulas, specifically factoring in inflation to determine the Future Value of current expenses.</p>
    <div class="formula-box">
      Future Expense = Current Expense × (1 + Inflation Rate)^Years to Retire<br>
      Corpus Needed = Annual Future Expense / Safe Withdrawal Rate
    </div>
    <ul class="formula-vars">
      <li><strong>Future Expense:</strong> The inflated cost of your lifestyle at the time of retirement.</li>
      <li><strong>Safe Withdrawal Rate (SWR):</strong> Often assumed at 3% to 4%. It is the percentage of your corpus you can withdraw annually without running out of money before you die.</li>
    </ul>
    <p>Once the required corpus is calculated, the tool uses the Future Value of an Annuity formula to work backward and tell you the monthly SIP needed to reach that massive corpus.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Early Retirement Planning (FIRE):</strong> Calculate if achieving Financial Independence, Retire Early (FIRE) by age 45 is mathematically feasible based on your current savings rate.</li>
      <li><strong>Course Correction:</strong> Discover if you are falling short of your retirement goals so you can increase your monthly SIPs immediately.</li>
      <li><strong>Lifestyle Adjustments:</strong> See how reducing your expected post-retirement expenses by just 10% drastically lowers the total corpus you need to save.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What is inflation and why does it matter?</h3>
        <p>Inflation is the rate at which the general cost of goods and services rises. It matters immensely because it erodes the purchasing power of your money. If you do not factor inflation into your retirement planning, your saved corpus will run out much faster than anticipated because everything will be more expensive.</p>
      </div>
      <div class="faq-item">
        <h3>What is the Safe Withdrawal Rate (SWR)?</h3>
        <p>The Safe Withdrawal Rate is the percentage of your retirement portfolio you can withdraw each year (adjusted for inflation) without depleting your funds over a 30-year retirement period. Historically, a 4% rule was standard, but many financial advisors now recommend a more conservative 3% or 3.5% for emerging markets like India.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/financial/sip-calculator" class="related-calc-link">SIP Calculator</a>
      <a href="/financial/ppf-calculator" class="related-calc-link">PPF Calculator</a>
      <a href="/financial/investment-calculator" class="related-calc-link">Investment Calculator</a>
    </div>
  </div>
</div>
`,
  'investment-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Investment Calculator</h2>
    <p>The Investment Calculator is a versatile, all-in-one financial modeling tool that projects the future growth of your wealth. Unlike specific calculators bound to a single asset class (like FDs or Mutual Funds), this calculator is flexible. It allows you to combine an initial lump sum deposit with ongoing monthly or annual contributions across any assumed rate of return.</p>
    <p>Whether you are investing in real estate, index funds, bonds, or a mixed portfolio, this tool visualizes the immense power of compounding over time. It is designed to answer the fundamental question of wealth creation: "If I start with X amount, and add Y amount every month at Z interest rate, how much will I have in 10 years?"</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>This calculator combines two fundamental financial formulas: the compound interest formula for the initial lump sum, and the future value of an annuity formula for the regular ongoing contributions.</p>
    <div class="formula-box">
      FV_total = [ P × (1 + r/n)^(nt) ] + [ PMT × ( ((1 + r/n)^(nt) - 1) / (r/n) ) ]
    </div>
    <ul class="formula-vars">
      <li><strong>FV_total:</strong> The final accumulated value of your investment.</li>
      <li><strong>P:</strong> The initial lump sum deposit.</li>
      <li><strong>PMT:</strong> The regular periodic contribution (e.g., monthly deposit).</li>
      <li><strong>r:</strong> Annual interest rate (in decimal).</li>
      <li><strong>n:</strong> Number of compounding periods per year.</li>
      <li><strong>t:</strong> Total number of years.</li>
    </ul>
    <p>The addition of the PMT (periodic payment) variable is what separates dynamic wealth building from static saving. Consistent contributions accelerate the compounding effect massively.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Hybrid Investing:</strong> See the outcome of investing an initial inheritance of ₹5 Lakhs, plus an ongoing ₹10,000 monthly SIP from your salary.</li>
      <li><strong>Portfolio Targetting:</strong> Determine exactly what rate of return you need to achieve (e.g., 8% vs. 12%) to reach a specific financial goal within a specific timeframe.</li>
      <li><strong>Opportunity Cost:</strong> Calculate how much wealth you lose by delaying your investment journey by 5 years.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>Does compounding happen only in the stock market?</h3>
        <p>No, compounding is a mathematical principle applicable to almost any reinvested return. It applies to bank fixed deposits (where interest earns interest), real estate appreciation, and dividend-reinvesting stocks or mutual funds.</p>
      </div>
      <div class="faq-item">
        <h3>How often should I review my investments?</h3>
        <p>While long-term investments should be left alone to compound, it is good practice to review your portfolio at least once a year. This allows you to rebalance your assets (e.g., move funds from over-performing equity to safe debt) to maintain your desired risk profile.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/financial/sip-calculator" class="related-calc-link">SIP Calculator</a>
      <a href="/financial/mutual-fund-calculator" class="related-calc-link">Mutual Fund Calculator</a>
      <a href="/financial/retirement-calculator" class="related-calc-link">Retirement Calculator</a>
    </div>
  </div>
</div>
`,
  'percentage-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Percentage Calculator</h2>
    <p>Percentages are a fundamental mathematical concept used in everyday life, from calculating shopping discounts and restaurant tips to analyzing business profit margins and tax rates. A Percentage Calculator is a streamlined utility designed to solve various percentage-related problems instantly, eliminating the need for manual mental math or complex equations.</p>
    <p>This tool typically handles three core functions: finding what a specific percentage of a number is, determining what percentage one number is of another, and calculating the percentage increase or decrease between two values. Its simplicity makes it an indispensable tool for students, shoppers, and financial professionals alike.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>Depending on what you are trying to solve, the percentage formula takes different algebraic forms. The base word "percent" literally translates to "per 100".</p>
    <p><strong>1. Finding the Percentage of a Number:</strong> (What is 20% of 50?)</p>
    <div class="formula-box">
      Result = (Percentage / 100) × Base Number
    </div>
    <p><strong>2. Finding the Percentage Value:</strong> (20 is what percent of 80?)</p>
    <div class="formula-box">
      Percentage = (Part / Whole) × 100
    </div>
    <p><strong>3. Percentage Change (Increase/Decrease):</strong></p>
    <div class="formula-box">
      % Change = [ (New Value - Old Value) / |Old Value| ] × 100
    </div>
    <p>If the result of the percentage change formula is positive, it signifies a percentage increase. If it is negative, it represents a percentage decrease.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Shopping Discounts:</strong> Quickly determine the final price of an item that is marked "30% Off".</li>
      <li><strong>Business Margins:</strong> Calculate the percentage profit margin on a product sold.</li>
      <li><strong>Financial Growth:</strong> Find out the exact percentage increase in your salary after a promotion, or the percentage return on an investment over a year.</li>
      <li><strong>Academic Grading:</strong> Convert test scores (e.g., 45 out of 60) into a standard percentage grade.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>How do I calculate a 20% tip quickly?</h3>
        <p>A quick mental math trick is to find 10% of the bill by simply moving the decimal point one place to the left. Then, multiply that number by 2 to get 20%. For example, on a $45.00 bill, 10% is $4.50. Therefore, 20% is $9.00.</p>
      </div>
      <div class="faq-item">
        <h3>Is a 50% decrease followed by a 50% increase the same as the original number?</h3>
        <p>No. If you start with 100 and decrease it by 50%, you have 50. If you then increase that 50 by 50%, you add 25 (which is 50% of 50). Your final number is 75, not the 100 you started with.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/financial/gst-calculator" class="related-calc-link">GST Calculator</a>
      <a href="/mathematical/scientific-calculator" class="related-calc-link">Scientific Calculator</a>
      <a href="/mathematical/algebra-calculator" class="related-calc-link">Algebra Calculator</a>
    </div>
  </div>
</div>
`
};

const updateSEO = () => {
  for (const [calcName, content] of Object.entries(calculators)) {
    let dirName = calcName;
    const mathematicalCalcs = ['percentage-calculator'];
    const basePath = mathematicalCalcs.includes(calcName) ? 'mathematical' : 'financial';
    
    const dirPath = path.join(__dirname, 'src/app/Allcalculators', dirName);
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory not found: ${dirPath}`);
      continue;
    }
    
    const files = fs.readdirSync(dirPath);
    const htmlFile = files.find(f => f.endsWith('.html'));
    
    if (htmlFile) {
      const htmlPath = path.join(dirPath, htmlFile);
      let html = fs.readFileSync(htmlPath, 'utf8');
      
      const seoMarker = '<!-- SEO Content Section -->';
      const markerIndex = html.indexOf(seoMarker);
      
      if (markerIndex !== -1) {
        html = html.substring(0, markerIndex) + content;
      } else {
        html += '\\n' + content;
      }
      
      fs.writeFileSync(htmlPath, html);
      console.log(`Updated SEO content for ${calcName}`);
    } else {
      console.log(`Could not find .html file in ${dirPath}`);
    }
  }
};

updateSEO();
