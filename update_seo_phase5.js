const fs = require('fs');
const path = require('path');

const calculators = {
  'algebra-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Algebra Calculator</h2>
    <p>An Algebra Calculator is a sophisticated mathematical utility designed to solve algebraic equations, simplify expressions, and handle polynomial arithmetic. Unlike standard calculators that only perform numerical arithmetic, this tool can parse, interpret, and manipulate abstract variables (like x, y, and z) according to the strict algebraic rules of order of operations (PEMDAS/BODMAS) and polynomial factorization.</p>
    <p>This calculator acts as a powerful educational assistant for middle school, high school, and early college students. It helps quickly verify manual homework solutions, understand the steps required to isolate a variable, and prevent mathematical errors when distributing negative signs or expanding complex binomials.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>Algebra calculators do not use a single formula; rather, they employ computer algebra systems (CAS) to apply algorithmic rules to symbols. Common operations include:</p>
    <p><strong>Solving Linear Equations:</strong></p>
    <div class="formula-box">
      If ax + b = c, then x = (c - b) / a
    </div>
    <p><strong>Solving Quadratic Equations:</strong></p>
    <div class="formula-box">
      If ax² + bx + c = 0, then<br>
      x = [ -b ± √(b² - 4ac) ] / 2a
    </div>
    <p>These algorithms instantly factor trinomials, distribute terms across parentheses, and combine like terms to present the simplest possible mathematical expression.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Homework Verification:</strong> Double-check your manual calculations for solving for 'x' in complex, multi-step linear or quadratic equations.</li>
      <li><strong>Simplifying Expressions:</strong> Instantly combine like terms and distribute coefficients in long polynomial expressions before graphing them.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What is the order of operations?</h3>
        <p>The order of operations is the mathematical rule dictating the sequence in which an equation is solved: Parentheses, Exponents, Multiplication and Division (from left to right), and Addition and Subtraction (from left to right). This calculator automatically strictly adheres to these rules.</p>
      </div>
      <div class="faq-item">
        <h3>Can it solve for multiple variables?</h3>
        <p>Basic algebra calculators typically solve for a single unknown variable (like 'x'). To solve for multiple variables (like 'x', 'y', and 'z'), you require a system of linear equations solver or a matrix calculator.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/mathematical/scientific-calculator" class="related-calc-link">Scientific Calculator</a>
      <a href="/mathematical/matrix-calculator" class="related-calc-link">Matrix Calculator</a>
      <a href="/mathematical/percentage-calculator" class="related-calc-link">Percentage Calculator</a>
    </div>
  </div>
</div>
`,
  'matrix-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Matrix Calculator</h2>
    <p>A Matrix Calculator is an advanced mathematical tool used to perform complex operations on matrices—rectangular arrays of numbers arranged in rows and columns. Matrices are the foundational mathematical structures used in linear algebra, computer graphics, cryptography, and quantum mechanics.</p>
    <p>Performing manual matrix operations, especially on 3x3 matrices or larger, is extremely tedious and highly prone to human error. This calculator automates essential operations such as Matrix Addition, Matrix Multiplication, finding the Determinant, computing the Inverse, and Transposing a matrix, saving students and engineers significant time.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>Different matrix operations require very different algorithms. One of the most common and complex operations is Matrix Multiplication.</p>
    <p><strong>Matrix Multiplication:</strong></p>
    <div class="formula-box">
      If C = A × B, then element c_ij is calculated as:<br>
      c_ij = (a_i1 × b_1j) + (a_i2 × b_2j) + ... + (a_in × b_nj)
    </div>
    <p><strong>Determinant of a 2x2 Matrix:</strong></p>
    <div class="formula-box">
      |A| = (a × d) - (b × c)
    </div>
    <p>Note that for matrix multiplication, the number of columns in the first matrix must equal the number of rows in the second matrix. Unlike regular multiplication, matrix multiplication is generally not commutative (A × B ≠ B × A).</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Solving Systems of Equations:</strong> Use the matrix inverse function (X = A⁻¹ × B) to quickly solve complex systems of linear equations with multiple variables.</li>
      <li><strong>Linear Algebra Studies:</strong> Quickly verify the determinant and transpose of 3x3 matrices during collegiate mathematics assignments.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What is a matrix determinant?</h3>
        <p>The determinant is a special scalar value calculated from a square matrix. It provides crucial information about the matrix; for example, if the determinant is zero, the matrix is "singular" and does not have an inverse, meaning a unique solution to the associated system of equations does not exist.</p>
      </div>
      <div class="faq-item">
        <h3>Why can't I multiply certain matrices together?</h3>
        <p>Matrix multiplication is only defined if the inner dimensions match. Specifically, the number of columns in Matrix A must exactly equal the number of rows in Matrix B. If you try to multiply a 2x3 matrix by a 4x2 matrix, the calculator will return a dimension error.</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/mathematical/algebra-calculator" class="related-calc-link">Algebra Calculator</a>
      <a href="/mathematical/scientific-calculator" class="related-calc-link">Scientific Calculator</a>
      <a href="/mathematical/statistics-calculator" class="related-calc-link">Statistics Calculator</a>
    </div>
  </div>
</div>
`,
  'statistics-calculator': `
<!-- SEO Content Section -->
<div class="calc-seo-content">
  <div class="seo-section">
    <h2>Understanding the Statistics Calculator</h2>
    <p>Data analysis is critical in modern science, business, and research. The Statistics Calculator is a robust tool designed to extract meaningful insights from raw datasets. By inputting a series of numbers, this calculator instantly processes descriptive statistics, revealing the central tendency and the dispersion of the data.</p>
    <p>It automatically computes the Mean (average), Median (middle value), Mode (most frequent value), Variance (spread of data), and Standard Deviation (average distance from the mean). This eliminates the tedious process of manually sorting data arrays and performing repetitive arithmetic, making it an invaluable tool for students, researchers, and data analysts.</p>
  </div>

  <div class="seo-section">
    <h2>The Formula Explained</h2>
    <p>The calculator processes the dataset using standard statistical formulas.</p>
    <p><strong>Mean (Average):</strong></p>
    <div class="formula-box">
      μ = ( Σx_i ) / N
    </div>
    <p><strong>Sample Standard Deviation:</strong></p>
    <div class="formula-box">
      s = √ [ Σ(x_i - μ)² / (N - 1) ]
    </div>
    <ul class="formula-vars">
      <li><strong>Σx_i:</strong> The sum of all individual data points.</li>
      <li><strong>N:</strong> The total number of data points.</li>
      <li><strong>μ:</strong> The calculated mean of the dataset.</li>
    </ul>
    <p>The standard deviation formula uses (N - 1) for a sample to correct for bias (Bessel's correction), whereas the population standard deviation would divide simply by N.</p>
  </div>

  <div class="seo-section">
    <h2>When to Use This Calculator</h2>
    <ul class="seo-steps">
      <li><strong>Academic Research:</strong> Quickly determine the standard deviation of survey results to understand how tightly clustered the participant responses are around the average.</li>
      <li><strong>Business Analytics:</strong> Calculate the median salary of a department to prevent extreme outliers (like a CEO's salary) from skewing the perceived average.</li>
    </ul>
  </div>

  <div class="seo-section">
    <h2>Frequently Asked Questions</h2>
    <div class="seo-faq">
      <div class="faq-item">
        <h3>What is the difference between Mean and Median?</h3>
        <p>The mean is the mathematical average of all numbers added together and divided by the count. The median is the literal middle number when the data is sorted from lowest to highest. The median is often a better representation of "typical" data because it is not heavily skewed by extreme outliers (very high or very low numbers).</p>
      </div>
      <div class="faq-item">
        <h3>What does Standard Deviation tell me?</h3>
        <p>Standard deviation measures the amount of variation or dispersion in a set of values. A low standard deviation indicates that the data points tend to be very close to the mean (consistent data). A high standard deviation indicates that the data points are spread out over a wider range (volatile data).</p>
      </div>
    </div>
  </div>

  <div class="seo-section">
    <h2>Related Calculators</h2>
    <div class="related-calc-grid">
      <a href="/mathematical/percentage-calculator" class="related-calc-link">Percentage Calculator</a>
      <a href="/mathematical/algebra-calculator" class="related-calc-link">Algebra Calculator</a>
      <a href="/mathematical/matrix-calculator" class="related-calc-link">Matrix Calculator</a>
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
