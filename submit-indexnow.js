const fs = require('fs');
const https = require('https');

// 1. Configuration
const BASE_URL = 'https://www.calculhub.in';
const KEY = '7d8e9a2b3c4d5e6f7a8b9c0d1e2f3a4b'; // Generated static verification key
const KEY_FILE = `public/${KEY}.txt`;

// 2. Load URLs from the sitemap generation file
const sitemapGenerator = require('./generate-sitemap.js');
// Fetching sitemap generation list implicitly (or we can extract paths directly from generate-sitemap.js)
const paths = [
  '/',
  '/about',
  '/blog',
  '/blog/home-loan-vs-rent-india',
  '/blog/car-loan-emi-calculator-india',
  '/blog/bike-loan-financing-guide-india',
  '/blog/sip-vs-lumpsum-vs-fd',
  '/blog/calculate-bike-loan-emi-guide',
  '/blog/understanding-bmi-health-metrics',
  '/blog/calorie-deficit-weight-loss-guide',
  '/blog/demystifying-compound-interest',
  '/blog/fixed-deposit-vs-mutual-funds',
  '/blog/matrix-multiplication-beginners-guide',
  '/blog/bmr-tdee-energy-expenditure-guide',
  '/blog/home-loan-prepayment-savings-guide',
  '/blog/probability-statistical-models-guide',
  '/blog/healthy-body-fat-percentage-tracking',
  '/blog/how-to-calculate-percentages-in-your-head',
  '/sitemap',
  '/other',
  '/financial/mortgage',
  '/financial/car-loan-emi-calculator',
  '/financial/lumpsum-calculator',
  '/financial/compound-interest',
  '/financial/gst-calculator',
  '/financial/sip-calculator',
  '/financial/fd-calculator',
  '/financial/tax-calculator',
  '/financial/mutual-fund-calculator',
  '/financial/ppf-calculator',
  '/financial/loan-eligibility-calculator',
  '/financial/home-loan-emi-calculator',
  '/financial/nps-calculator',
  '/financial/cagr-calculator',
  '/financial/retirement-calculator',
  '/financial/investment-calculator',
  '/financial/bike-loan-emi-calculator',
  '/financial/education-loan-emi-calculator',
  '/mathematical/percentage-calculator',
  '/mathematical/scientific-calculator',
  '/mathematical/algebra-calculator',
  '/mathematical/matrix-calculator',
  '/mathematical/statistics-calculator',
  '/mathematical/gpa-calculator',
  '/mathematical/fraction-calculator',
  '/health/calorie-calculator',
  '/health/bmi-calculator',
  '/health/body-fat-calculator',
  '/health/ideal-weight-calculator',
  '/health/bmr-tdee-calculator',
  '/health/pregnancy-calculator',
  '/health/ovulation-calculator',
  '/market/currency-converter',
  '/market/crypto-calculator',
  '/market/gold-silver-calculator',
  '/utility',
  '/utility/age-calculator',
  '/utility/hours-calculator',
  '/privacy-policy',
  '/terms',
  '/contact'
];

const urls = paths.map(path => `${BASE_URL}${path}`);

// 3. Write key validation file
try {
  fs.writeFileSync(KEY_FILE, KEY);
  console.log(`Verification key file written to: ${KEY_FILE}`);
} catch (err) {
  console.error('Failed to write key file:', err);
  process.exit(1);
}

// 4. Submit to IndexNow API (Bing)
const payload = JSON.stringify({
  host: 'www.calculhub.in',
  key: KEY,
  keyLocation: `${BASE_URL}/${KEY}.txt`,
  urlList: urls
});

const options = {
  hostname: 'api.indexnow.org',
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log('Sending submission request to IndexNow...');
const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => { responseData += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log(`Success! IndexNow has accepted the URL list for crawling (Status: ${res.statusCode}).`);
    } else {
      console.error(`Error: Received status code ${res.statusCode} from IndexNow.`);
      console.error('Response data:', responseData);
    }
  });
});

req.on('error', (err) => {
  console.error('Submission request failed:', err);
});

req.write(payload);
req.end();
