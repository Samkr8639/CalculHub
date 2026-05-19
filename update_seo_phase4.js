const fs = require('fs');
const path = require('path');

const calculators = {
  'scientific-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Scientific Calculator</h2>
    <p>A Scientific Calculator extends the capabilities of a standard calculator by introducing advanced mathematical functions necessary for science, engineering, and higher mathematics. Beyond basic arithmetic (addition, subtraction, multiplication, and division), it provides immediate access to trigonometric functions, logarithms, exponential operations, and complex scientific notation.</p>
    <p>This digital tool is indispensable for students tackling high school or collegiate physics, chemistry, and calculus. It allows for the precise computation of very large or very small numbers (often required in astronomy or quantum mechanics) and helps solve equations involving non-linear relationships that a standard desktop calculator simply cannot process.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>While a scientific calculator doesn't rely on a single formula, it mathematically processes a vast array of standardized functions. Some of the most critical include:</p>
    <p><strong>1. Trigonometry (SOH CAH TOA):</strong></p>
    <div class="formula-box">
      sin(θ) = Opposite / Hypotenuse<br>
      cos(θ) = Adjacent / Hypotenuse<br>
      tan(θ) = Opposite / Adjacent
    </div>
    <p><strong>2. Logarithms:</strong></p>
    <div class="formula-box">
      If 10^y = x, then log₁₀(x) = y<br>
      If e^y = x, then ln(x) = y
    </div>
    <p>The calculator utilizes complex algorithms (like the CORDIC algorithm or Taylor series expansions) internally to compute these transcendental functions with high precision in milliseconds.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Physics and Engineering:</strong> Calculate vector components using sine and cosine functions for force and velocity problems.</li>
      <li><strong>Chemistry:</strong> Determine the pH of a solution using base-10 logarithms based on hydrogen ion concentration.</li>
      <li><strong>Advanced Finance:</strong> Calculate continuous compounding interest using the natural exponential function (e^x).</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What is the difference between degrees and radians?</h3>
        <p>Degrees and radians are two different units for measuring angles. A full circle is 360 degrees or 2π radians. In advanced mathematics (like calculus), radians are universally preferred because they simplify derivative and integral formulas. Always ensure your calculator is set to the correct mode for your specific problem.</p>
      </div>
      <div class="faq-item">
        <h3>What does the "e" stand for on a scientific calculator?</h3>
        <p>The letter "e" represents Euler's number, a fundamental mathematical constant approximately equal to 2.71828. It is the base of the natural logarithm (ln) and is crucial in modeling continuous growth or decay processes in nature and finance.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/mathematical/percentage-calculator" class="related-calc-link">Percentage Calculator</a>
      <a href="/mathematical/algebra-calculator" class="related-calc-link">Algebra Calculator</a>
      <a href="/mathematical/statistics-calculator" class="related-calc-link">Statistics Calculator</a>
    </div>
  </div>
</div>
`,
  'calorie-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Calorie Calculator (TDEE)</h2>
    <p>A Calorie Calculator is an essential nutritional tool used to estimate your Total Daily Energy Expenditure (TDEE). Your TDEE represents the total number of calories your body burns in a 24-hour period, accounting for both your resting metabolism (keeping your organs functioning) and your physical activity level. Understanding this metric is the absolute foundation of any diet plan, whether your goal is to lose weight, build muscle, or maintain your current physique.</p>
    <p>By inputting your age, gender, height, weight, and activity level, the calculator provides a personalized caloric baseline. To lose weight, you must consume fewer calories than your TDEE (a caloric deficit). To gain weight or build muscle, you must consume more calories than your TDEE (a caloric surplus).</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>Most modern calorie calculators use the Mifflin-St Jeor equation to find your Basal Metabolic Rate (BMR), as it is currently considered the most accurate standard formula by health professionals. The BMR is then multiplied by an Activity Multiplier to find the TDEE.</p>
    <p><strong>Mifflin-St Jeor Equation (BMR):</strong></p>
    <div class="formula-box">
      Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5<br>
      Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
    </div>
    <ul class="formula-vars">
      <li><strong>Sedentary (little/no exercise):</strong> BMR × 1.2</li>
      <li><strong>Lightly active (1-3 days/week):</strong> BMR × 1.375</li>
      <li><strong>Moderately active (3-5 days/week):</strong> BMR × 1.55</li>
      <li><strong>Very active (6-7 days/week):</strong> BMR × 1.725</li>
    </ul>
    <p>For example, if a man has a BMR of 1,800 calories and exercises moderately, his TDEE is 1,800 × 1.55 = 2,790 calories per day.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Weight Loss Planning:</strong> Subtract 500 calories from your calculated TDEE to create a sustainable deficit, which generally leads to about 0.5 kg (1 lb) of fat loss per week.</li>
      <li><strong>Muscle Building (Bulking):</strong> Add 300 to 500 calories to your TDEE to provide your body with the excess energy required to synthesize new muscle tissue.</li>
      <li><strong>Diet Auditing:</strong> Compare your current daily food intake against your TDEE to understand why your weight is fluctuating or stalling.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>Is it safe to eat below my BMR to lose weight faster?</h3>
        <p>No, it is highly discouraged. Your BMR is the minimum energy required to keep your vital organs functioning at rest. Consistently eating below your BMR can lead to metabolic adaptation (slowing metabolism), muscle loss, nutrient deficiencies, and severe fatigue. Always base your caloric deficit on your TDEE, not your BMR.</p>
      </div>
      <div class="faq-item">
        <h3>Why do men generally have a higher BMR than women?</h3>
        <p>BMR is heavily influenced by lean muscle mass. On average, men naturally have a higher percentage of lean muscle and a lower percentage of body fat than women of the same weight. Because muscle tissue burns more calories at rest than fat tissue, men typically require more daily calories.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/health/bmi-calculator" class="related-calc-link">BMI Calculator</a>
      <a href="/health/body-fat-calculator" class="related-calc-link">Body Fat Calculator</a>
      <a href="/health/ideal-weight-calculator" class="related-calc-link">Ideal Weight Calculator</a>
    </div>
  </div>
</div>
`,
  'bmi-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the BMI Calculator</h2>
    <p>Body Mass Index (BMI) is a universally recognized screening tool used to categorize a person's weight relative to their height. The BMI Calculator provides a simple numerical value that medical professionals use as a primary indicator of potential health risks associated with being underweight, overweight, or obese. While it does not directly measure body fat, it correlates strongly with metabolic disease risks on a population level.</p>
    <p>It is important to note that BMI is a screening tool, not a diagnostic one. It does not account for muscle mass, bone density, overall body composition, or racial and sex differences. Therefore, highly muscular athletes may register as "overweight" or "obese" on a BMI chart despite having very low body fat and excellent metabolic health.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>The mathematics behind BMI is intentionally simple, designed by Adolphe Quetelet in the 19th century to easily categorize large populations.</p>
    <p><strong>Metric Formula:</strong></p>
    <div class="formula-box">
      BMI = Weight (kg) / [Height (m)]²
    </div>
    <p><strong>Standard Categories (WHO):</strong></p>
    <ul class="formula-vars">
      <li><strong>Underweight:</strong> BMI less than 18.5</li>
      <li><strong>Normal weight:</strong> BMI 18.5 to 24.9</li>
      <li><strong>Overweight:</strong> BMI 25 to 29.9</li>
      <li><strong>Obesity:</strong> BMI 30 or greater</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Health Screening:</strong> Quickly assess if your current weight falls within a statistically healthy range for your height.</li>
      <li><strong>Tracking Progress:</strong> Monitor changes in your BMI category over time as you engage in a long-term weight loss or weight gain program.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>Is BMI accurate for bodybuilders and athletes?</h3>
        <p>No. Because BMI only relies on total weight and height, it cannot distinguish between the weight of fat and the weight of muscle. Since muscle is denser than fat, muscular athletes often have high BMIs that incorrectly classify them as overweight or obese.</p>
      </div>
      <div class="faq-item">
        <h3>Are BMI categories the same for Asian populations?</h3>
        <p>No. Health organizations have found that individuals of Asian descent often face higher risks for type 2 diabetes and cardiovascular disease at lower BMIs than Caucasian populations. Therefore, modified BMI cut-offs are often used in Asian countries, where a BMI of 23 or higher may be considered overweight.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/health/body-fat-calculator" class="related-calc-link">Body Fat Calculator</a>
      <a href="/health/calorie-calculator" class="related-calc-link">Calorie (TDEE) Calculator</a>
      <a href="/health/ideal-weight-calculator" class="related-calc-link">Ideal Weight Calculator</a>
    </div>
  </div>
</div>
`,
  'body-fat-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Body Fat Calculator</h2>
    <p>While BMI only looks at your total weight, a Body Fat Calculator dives deeper by estimating your overall body composition—specifically dividing your total weight into Lean Body Mass (muscle, bone, organs, water) and Fat Mass. Your body fat percentage is a far superior indicator of health and fitness levels than the scale weight alone.</p>
    <p>This calculator utilizes tape measurement methods (such as the U.S. Navy Method) to estimate the proportion of fat on your body. By tracking your body fat percentage alongside your weight, you can ensure that the weight you are losing on a diet is actually fat, rather than precious muscle tissue.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>The U.S. Navy Body Fat formula is an empirical equation developed by the military to quickly assess the fitness of service members without requiring expensive medical equipment. It relies on the circumferences of specific body parts.</p>
    <p><strong>U.S. Navy Method (Metric):</strong></p>
    <div class="formula-box">
      Men: %Fat = 495 / [ 1.0324 - 0.19077(log₁₀(Waist - Neck)) + 0.15456(log₁₀(Height)) ] - 450<br><br>
      Women: %Fat = 495 / [ 1.29579 - 0.35004(log₁₀(Waist + Hip - Neck)) + 0.22100(log₁₀(Height)) ] - 450
    </div>
    <p>The logarithms used in the formula account for the non-linear distribution of body fat. For the most accurate results, measurements should be taken snugly against the skin without compressing the underlying tissue.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Fitness Tracking:</strong> Measure your circumferences every 2–4 weeks to ensure your exercise and diet regimen is effectively reducing fat rather than just water weight.</li>
      <li><strong>Setting Realistic Goals:</strong> If you know your current body fat percentage and lean mass, you can calculate exactly how many pounds of fat you need to lose to reach a target body fat percentage (e.g., reaching 15% body fat for visible abs).</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What is a healthy body fat percentage?</h3>
        <p>Healthy ranges differ by gender due to essential fat required for reproductive health. For men, 10-20% is generally considered healthy and fit. For women, 20-30% is the standard healthy range. Falling below essential fat levels (approx. 2-5% for men, 10-13% for women) is dangerous and unsustainable.</p>
      </div>
      <div class="faq-item">
        <h3>How accurate is the tape measure (Navy) method?</h3>
        <p>The U.S. Navy method is an estimation tool. While it is generally within 3-4% of more clinical methods (like DEXA scans or hydrostatic weighing), its real value lies in its consistency. If you measure yourself the exact same way every two weeks, it is highly accurate at tracking the <em>trend</em> of your fat loss.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/health/bmi-calculator" class="related-calc-link">BMI Calculator</a>
      <a href="/health/calorie-calculator" class="related-calc-link">Calorie (TDEE) Calculator</a>
      <a href="/health/ideal-weight-calculator" class="related-calc-link">Ideal Weight Calculator</a>
    </div>
  </div>
</div>
`,
  'ideal-weight-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Ideal Weight Calculator</h2>
    <p>The Ideal Weight Calculator is a health tool that helps individuals determine an optimal weight target based on their gender and height. Over the decades, various scientists and medical professionals have developed empirical formulas to calculate Ideal Body Weight (IBW), originally designed to help doctors determine precise medical dosages.</p>
    <p>Today, this calculator provides a suggested weight range using the most famous of these equations (Hamwi, Devine, Robinson, and Miller). It is important to remember that "ideal" in this context refers to statistical averages and medical baselines; it does not account for an individual's unique muscle mass, frame size, or aesthetic goals. It serves best as a general guideline rather than a strict rule.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>There are multiple accepted formulas for calculating IBW. The Devine Formula (1974) is one of the most widely used in medical settings.</p>
    <p><strong>The Devine Formula:</strong></p>
    <div class="formula-box">
      Men: IBW = 50.0 kg + 2.3 kg for every inch over 5 feet<br>
      Women: IBW = 45.5 kg + 2.3 kg for every inch over 5 feet
    </div>
    <p><strong>The Hamwi Formula (1964):</strong></p>
    <div class="formula-box">
      Men: IBW = 48.0 kg + 2.7 kg for every inch over 5 feet<br>
      Women: IBW = 45.5 kg + 2.2 kg for every inch over 5 feet
    </div>
    <p>Because these formulas vary slightly, the calculator usually presents a range or an average of the results to provide a more realistic weight target.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Setting Diet Goals:</strong> If you are beginning a major weight loss journey and are unsure what a healthy target weight should be, this provides a medically sound baseline to aim for.</li>
      <li><strong>Medical Awareness:</strong> Understand the baseline weight that pharmacists and doctors may use to calculate certain drug dosages or assess surgical risks.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>Does the ideal weight formula account for muscle mass?</h3>
        <p>No. Like the BMI calculation, Ideal Body Weight formulas rely strictly on height and gender. They assume an average body composition. If you are a bodybuilder or naturally have a very large, dense skeletal frame, your true healthy weight may be significantly higher than the calculator's result.</p>
      </div>
      <div class="faq-item">
        <h3>Which formula is the most accurate?</h3>
        <p>None of the formulas are perfectly accurate for everyone, which is why a range is preferred. The Devine formula is the most universally used in clinical medicine, but the Hamwi formula is often favored by nutritionists for setting dietary weight goals. A healthy weight is best determined by a combination of this calculation, your body fat percentage, and advice from a medical professional.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/health/bmi-calculator" class="related-calc-link">BMI Calculator</a>
      <a href="/health/body-fat-calculator" class="related-calc-link">Body Fat Calculator</a>
      <a href="/health/calorie-calculator" class="related-calc-link">Calorie (TDEE) Calculator</a>
    </div>
  </div>
</div>
`
};

const updateSEO = () => {
  for (const [calcName, content] of Object.entries(calculators)) {
    let dirName = calcName;
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
