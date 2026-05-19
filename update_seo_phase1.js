const fs = require('fs');
const path = require('path');

const calculators = {
  'mortgage-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Mortgage Calculator</h2>
    <p>A mortgage is typically one of the most significant financial commitments a person will make in their lifetime. A Mortgage Calculator is an essential financial tool designed to help prospective homebuyers and current homeowners estimate their monthly mortgage payments. By breaking down the complex calculations involved in home financing, this tool provides clarity on how different variables—such as loan amount, interest rate, and loan term—affect your overall financial obligation.</p>
    <p>Beyond simply calculating the principal and interest, an advanced understanding of your mortgage allows you to budget effectively for other homeownership costs, including property taxes, homeowner's insurance, and private mortgage insurance (PMI). This level of financial foresight is crucial for making informed decisions, whether you are purchasing your first home, considering a refinance, or evaluating an investment property.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>The mathematical foundation of a standard fixed-rate mortgage calculation relies on the amortization formula. This formula determines the fixed monthly payment required to fully pay off the principal and interest over a set number of months.</p>
    <div class="formula-box">
      M = P [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]
    </div>
    <ul class="formula-vars">
      <li><strong>M</strong> = Total monthly payment</li>
      <li><strong>P</strong> = Principal loan amount</li>
      <li><strong>r</strong> = Monthly interest rate (annual rate divided by 12)</li>
      <li><strong>n</strong> = Number of payments (loan term in years multiplied by 12)</li>
    </ul>
    <p>While the formula provides a precise mathematical figure, it is important to remember that it only accounts for principal and interest. Additional monthly expenses, such as taxes and insurance, must be added to this base figure to determine the true cost of homeownership.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Home Buying Planning:</strong> Use it before starting your home search to determine a realistic price range that fits your monthly budget.</li>
      <li><strong>Refinancing Analysis:</strong> Evaluate whether refinancing your current mortgage at a lower interest rate will result in significant monthly or long-term savings.</li>
      <li><strong>Loan Comparison:</strong> Compare the financial impact of different loan terms, such as a 15-year versus a 30-year mortgage, to understand the trade-offs between lower monthly payments and total interest paid.</li>
      <li><strong>Extra Payment Strategy:</strong> Discover how making additional principal payments can reduce the total interest paid and shorten the life of the loan.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What is PMI (Private Mortgage Insurance)?</h3>
        <p>Private Mortgage Insurance (PMI) is a specialized type of insurance policy typically required by lenders if your down payment is less than 20% of the home's purchase price. It protects the lender in the event that you default on the loan. PMI is usually an added monthly expense until you build sufficient equity in the property.</p>
      </div>
      <div class="faq-item">
        <h3>How does the loan term affect my payments?</h3>
        <p>The loan term significantly impacts both your monthly payment and the total interest paid. A shorter term (e.g., 15 years) results in higher monthly payments but substantially less total interest paid over the life of the loan. Conversely, a longer term (e.g., 30 years) offers lower, more manageable monthly payments but incurs more total interest.</p>
      </div>
      <div class="faq-item">
        <h3>Should I pay points to lower my interest rate?</h3>
        <p>Mortgage points, or discount points, allow you to pay an upfront fee at closing in exchange for a lower interest rate. This can be a smart strategy if you plan to stay in the home for a long time, as the long-term interest savings will eventually outweigh the initial upfront cost.</p>
      </div>
    </div>
  </div>
  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/financial/home-loan-emi-calculator" class="related-calc-link">Home Loan EMI</a>
      <a href="/financial/loan-eligibility-calculator" class="related-calc-link">Loan Eligibility Calculator</a>
      <a href="/financial/fd-calculator" class="related-calc-link">FD Calculator</a>
    </div>
  </div>
</div>
`,
  'compound-interest': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Compound Interest Calculator</h2>
    <p>Compound interest is frequently referred to as the eighth wonder of the world due to its remarkable ability to exponentially grow wealth over time. A Compound Interest Calculator is a powerful financial modeling tool that illustrates how an initial investment, combined with regular contributions and accumulated interest, grows over a specified period. Unlike simple interest, which is calculated solely on the principal amount, compound interest is calculated on the principal plus any interest that has previously accrued.</p>
    <p>This "interest on interest" effect means that your wealth grows at an accelerating rate. By visualizing this growth, investors can better understand the immense value of starting to save and invest early. This calculator is an indispensable resource for anyone planning for retirement, saving for a major purchase, or simply looking to maximize their financial returns.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>The calculation of compound interest relies on a standard mathematical formula that accounts for the principal, the interest rate, the compounding frequency, and the time horizon. The formula for the future value of an investment with compound interest is:</p>
    <div class="formula-box">
      A = P (1 + r/n)^(nt)
    </div>
    <ul class="formula-vars">
      <li><strong>A</strong> = Future value of the investment, including interest</li>
      <li><strong>P</strong> = Principal investment amount (the initial deposit)</li>
      <li><strong>r</strong> = Annual interest rate (in decimal form)</li>
      <li><strong>n</strong> = Number of times that interest is compounded per unit t (e.g., 12 for monthly)</li>
      <li><strong>t</strong> = Time the money is invested for (in years)</li>
    </ul>
    <p>If regular contributions are made (such as monthly deposits), an additional formula for the future value of a series is integrated. The compounding frequency (n) plays a critical role; the more frequently interest is compounded, the greater the final accumulated amount will be.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Retirement Planning:</strong> Project how your current savings and future contributions will grow by the time you reach retirement age.</li>
      <li><strong>Investment Strategy:</strong> Compare the long-term outcomes of different investment vehicles with varying expected rates of return.</li>
      <li><strong>Goal Setting:</strong> Determine the exact monthly contribution required to reach a specific financial milestone, such as a down payment for a house, within a set timeframe.</li>
      <li><strong>Educational Purposes:</strong> Visualize the dramatic difference between starting to invest in your 20s versus your 30s or 40s.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What is the difference between simple and compound interest?</h3>
        <p>Simple interest is calculated only on the initial principal amount. Compound interest, however, is calculated on the principal amount AND the accumulated interest of previous periods. Over time, compound interest results in significantly higher returns because your money is essentially earning money on itself.</p>
      </div>
      <div class="faq-item">
        <h3>How does compounding frequency affect my returns?</h3>
        <p>Compounding frequency refers to how often accumulated interest is added back to the principal. Common frequencies include annually, semi-annually, quarterly, monthly, and daily. Generally, the more frequently interest is compounded, the higher your total return will be, as the interest has more opportunities to earn additional interest.</p>
      </div>
      <div class="faq-item">
        <h3>Does this calculator account for inflation?</h3>
        <p>The standard compound interest formula calculates the nominal future value of your investment. To understand the true purchasing power of that future money, you must factor in inflation. Some advanced calculations allow you to subtract the expected inflation rate from your expected return to find your "real" rate of return.</p>
      </div>
    </div>
  </div>
  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/financial/sip-calculator" class="related-calc-link">SIP Calculator</a>
      <a href="/financial/fd-calculator" class="related-calc-link">Fixed Deposit Calculator</a>
      <a href="/financial/mutual-fund-calculator" class="related-calc-link">Mutual Fund Calculator</a>
    </div>
  </div>
</div>
`,
  'gst-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the GST Calculator</h2>
    <p>The Goods and Services Tax (GST) is an indirect, broad-based consumption tax utilized in many countries, including India, Australia, Canada, and New Zealand. It is designed to be a comprehensive, multi-stage, destination-based tax that is levied on every value addition. A GST Calculator is an essential utility for businesses, accountants, and consumers to accurately and instantly determine the tax amount applicable to a specific product or service.</p>
    <p>This tool simplifies the process of either adding GST to a net price (to find the gross total) or extracting GST from a gross price (to find the original net price). By automating these calculations, the tool ensures absolute accuracy in invoicing, financial reporting, and compliance with national tax regulations. It is an indispensable part of daily commercial operations for transparent pricing and correct tax remittance.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>The mathematical operations for GST are straightforward but depend on whether you are adding the tax to a base price or removing it from a total price.</p>
    <p><strong>To Add GST (Finding Gross Price):</strong></p>
    <div class="formula-box">
      GST Amount = (Net Price × GST Rate) / 100<br>
      Gross Price = Net Price + GST Amount
    </div>
    <p><strong>To Remove GST (Finding Net Price):</strong></p>
    <div class="formula-box">
      Net Price = Gross Price / [ 1 + (GST Rate / 100) ]<br>
      GST Amount = Gross Price - Net Price
    </div>
    <ul class="formula-vars">
      <li><strong>Net Price:</strong> The cost of the good or service before tax.</li>
      <li><strong>Gross Price:</strong> The total cost including the tax.</li>
      <li><strong>GST Rate:</strong> The applicable percentage slab (e.g., 5%, 12%, 18%, 28%).</li>
    </ul>
    <p>Using these specific formulas ensures that the tax component is calculated precisely, preventing errors that can arise from manual, ad-hoc percentage estimations.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Invoice Generation:</strong> Quickly calculate the exact tax amount to add to a client invoice to ensure legal tax compliance.</li>
      <li><strong>Price Structuring:</strong> Determine the final retail price (MRP) of a product after factoring in the required government tax slab.</li>
      <li><strong>Expense Tracking:</strong> Extract the base cost from a tax-inclusive receipt to accurately record business expenses and claim Input Tax Credit (ITC).</li>
      <li><strong>Consumer Awareness:</strong> Understand exactly how much of a purchase price is going toward the actual product versus government taxes.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What are the standard GST slabs in India?</h3>
        <p>In India, the GST council has structured the tax into primary slabs: 0% (essential goods), 5% (mass consumption items), 12% (standard goods), 18% (standard services and most goods), and 28% (luxury items and sin goods). The appropriate slab depends strictly on the HSN/SAC code of the item or service.</p>
      </div>
      <div class="faq-item">
        <h3>What is the difference between CGST, SGST, and IGST?</h3>
        <p>CGST (Central GST) and SGST (State GST) are levied simultaneously on intra-state supplies (sales within the same state). IGST (Integrated GST) is levied on inter-state supplies (sales between different states) and imports. The total tax rate remains the same, but the collection is divided between the central and state governments.</p>
      </div>
      <div class="faq-item">
        <h3>How do I calculate the base price from an MRP?</h3>
        <p>If you have the Maximum Retail Price (which includes GST) and need the base price, you cannot simply subtract the tax percentage from the total. You must use the extraction formula: Base Price = MRP / (1 + (Rate/100)). For example, an item costing ₹118 at an 18% rate has a base price of 118 / 1.18 = ₹100.</p>
      </div>
    </div>
  </div>
  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/financial/tax-calculator" class="related-calc-link">Income Tax Calculator</a>
      <a href="/mathematical/percentage-calculator" class="related-calc-link">Percentage Calculator</a>
    </div>
  </div>
</div>
`,
  'sip-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the SIP Calculator</h2>
    <p>A Systematic Investment Plan (SIP) is a highly effective, disciplined method of investing in mutual funds. It allows investors to allocate a fixed amount of money at regular intervals—typically monthly—into a chosen mutual fund scheme. A SIP Calculator is a comprehensive financial estimation tool that helps investors project the future value of these regular investments over a designated time horizon, assuming a specific annualized rate of return.</p>
    <p>This calculator relies on the principle of compounding, highlighting how small, consistent investments can accumulate into a substantial financial corpus over years or decades. By removing the need to "time the market," SIPs utilize Rupee Cost Averaging, ensuring that investors buy more units when the market is low and fewer when the market is high. This tool provides a clear, quantitative visualization of that wealth-creation process.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>The SIP Calculator utilizes the future value of an annuity formula to calculate the accumulated wealth. Because contributions are made at the beginning of each period (typically), the formula is structured to account for regular compounding.</p>
    <div class="formula-box">
      FV = P × [ ((1 + i)^n - 1) / i ] × (1 + i)
    </div>
    <ul class="formula-vars">
      <li><strong>FV:</strong> Future Value of the investment (the maturity amount).</li>
      <li><strong>P:</strong> The regular monthly contribution amount.</li>
      <li><strong>i:</strong> The monthly rate of return (Annual Rate / 12 / 100).</li>
      <li><strong>n:</strong> The total number of monthly contributions (Years × 12).</li>
    </ul>
    <p>This mathematical model clearly demonstrates that the true power of a SIP lies not just in the amount invested, but significantly in the duration of the investment. A longer "n" value results in exponential, rather than linear, growth.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Goal-Based Planning:</strong> Calculate the exact monthly SIP amount required to achieve a specific financial goal, such as purchasing a home, funding a child's education, or building a retirement corpus.</li>
      <li><strong>Wealth Projection:</strong> Visualize how a current comfortable monthly savings amount will grow over 10, 20, or 30 years to assess long-term financial security.</li>
      <li><strong>Comparing Scenarios:</strong> Analyze the dramatic difference in the final corpus by slightly increasing the monthly investment amount or extending the investment duration by a few years.</li>
      <li><strong>Understanding Market Returns:</strong> Test different conservative vs. aggressive expected return rates (e.g., 10% vs. 15%) to set realistic financial expectations.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What is Rupee Cost Averaging?</h3>
        <p>Rupee Cost Averaging is an investment strategy inherent to SIPs where you invest a fixed amount regularly, regardless of market conditions. When the market is high, your fixed amount buys fewer units. When the market is low, it buys more units. Over time, this averages out the cost per unit, reducing the impact of market volatility.</p>
      </div>
      <div class="faq-item">
        <h3>Are the returns shown by the SIP calculator guaranteed?</h3>
        <p>No, the returns projected by a SIP calculator are not guaranteed. Mutual funds are subject to market risks, and the calculator provides an estimate based on a hypothetical, constant annualized return. Actual market returns fluctuate, and the final value may be higher or lower than the projection.</p>
      </div>
      <div class="faq-item">
        <h3>Can I change my SIP amount later?</h3>
        <p>Yes, most mutual fund platforms allow high flexibility. You can choose to stop, pause, increase (step-up), or decrease your SIP amount at any time without facing penalties. A "Step-Up SIP" allows you to automatically increase your contribution annually in line with income growth.</p>
      </div>
    </div>
  </div>
  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/financial/mutual-fund-calculator" class="related-calc-link">Mutual Fund Calculator</a>
      <a href="/financial/compound-interest" class="related-calc-link">Compound Interest Calculator</a>
      <a href="/financial/ppf-calculator" class="related-calc-link">PPF Calculator</a>
    </div>
  </div>
</div>
`,
  'fd-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Fixed Deposit (FD) Calculator</h2>
    <p>A Fixed Deposit (FD) is one of the most secure and universally trusted investment instruments offered by banks and non-banking financial companies (NBFCs). It guarantees a fixed interest rate on a lump sum deposit over a predetermined period. An FD Calculator is a specialized financial tool designed to accurately compute the maturity amount and total interest earned on this deposit at the end of its tenure.</p>
    <p>Because FD interest rates are locked in at the time of investment, they provide complete immunity against market volatility, ensuring capital preservation and predictable growth. This calculator allows investors to quickly evaluate the returns from various banks by inputting different interest rates, tenures, and compounding frequencies, thereby enabling them to choose the most lucrative risk-free investment option for their portfolio.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>The calculation of a Fixed Deposit depends on the type of FD chosen. There are generally two types: Cumulative (where interest is reinvested) and Non-Cumulative (where interest is paid out regularly). For the standard cumulative FD, the compound interest formula is applied.</p>
    <div class="formula-box">
      A = P (1 + r/n)^(n*t)
    </div>
    <ul class="formula-vars">
      <li><strong>A:</strong> The maturity amount (Principal + Earned Interest).</li>
      <li><strong>P:</strong> The Principal deposit amount.</li>
      <li><strong>r:</strong> The annual rate of interest (expressed as a decimal, e.g., 0.07 for 7%).</li>
      <li><strong>n:</strong> The compounding frequency per year (e.g., 4 for quarterly compounding).</li>
      <li><strong>t:</strong> The tenure or time period of the deposit in years.</li>
    </ul>
    <p>In India, most banks compound FD interest on a quarterly basis (n=4). For short-term FDs (less than 6 months), simple interest is often used instead of compound interest.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Investment Comparison:</strong> Compare the final maturity values across different banks offering varying interest rates to maximize your guaranteed returns.</li>
      <li><strong>Tenure Optimization:</strong> Analyze how slight changes in the deposit tenure (e.g., 1 year vs. 1 year and 5 days) can sometimes push the deposit into a higher interest rate slab.</li>
      <li><strong>Cash Flow Planning:</strong> Determine exactly how much liquid cash will be available to you on a specific future date to fund a planned expense like a wedding or a down payment.</li>
      <li><strong>Tax Planning:</strong> Estimate the interest income to assess potential Tax Deducted at Source (TDS) implications and decide if submitting forms 15G/15H is necessary.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>Is FD interest taxable?</h3>
        <p>Yes, the interest earned on a Fixed Deposit is fully taxable under the head "Income from Other Sources" according to your applicable income tax slab. If the interest earned in a financial year exceeds ₹40,000 (₹50,000 for senior citizens), the bank will deduct TDS at 10% before crediting the interest.</p>
      </div>
      <div class="faq-item">
        <h3>What is the difference between cumulative and non-cumulative FDs?</h3>
        <p>In a cumulative FD, the interest earned is reinvested and added to the principal, leading to compounding benefits and a single lump-sum payout at maturity. In a non-cumulative FD, the interest is paid out to your savings account at regular intervals (monthly, quarterly, or annually), providing a steady stream of income but eliminating compounding benefits.</p>
      </div>
      <div class="faq-item">
        <h3>Can I withdraw my Fixed Deposit before maturity?</h3>
        <p>Yes, most FDs allow premature withdrawal in case of financial emergencies. However, banks typically levy a penalty (usually 0.5% to 1%) on the applicable interest rate for the period the deposit was held. It is advisable to check the specific premature withdrawal terms of your bank before investing.</p>
      </div>
    </div>
  </div>
  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/financial/compound-interest" class="related-calc-link">Compound Interest Calculator</a>
      <a href="/financial/ppf-calculator" class="related-calc-link">PPF Calculator</a>
      <a href="/financial/sip-calculator" class="related-calc-link">SIP Calculator</a>
    </div>
  </div>
</div>
`
};

const updateSEO = () => {
  for (const [calcName, content] of Object.entries(calculators)) {
    // Map object keys to actual directory names if they differ
    let dirName = calcName;
    if (calcName === 'compound-interest') dirName = 'compound-interest-calculator';
    
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
      
      // We will look for <!-- SEO Content Section --> and replace from there to the end of the file.
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
      console.log(`Could not find ${htmlPath}`);
    }
  }
};

updateSEO();
