const fs = require('fs');
const { google } = require('googleapis');

// 1. Setup Google OAuth2 Client using the downloaded JSON key file
const KEY_FILE = './google-key.json';

if (!fs.existsSync(KEY_FILE)) {
  console.error(`Error: Google JSON key file not found at ${KEY_FILE}. Please place it there first.`);
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE,
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const indexing = google.indexing({
  version: 'v3',
  auth: auth,
});

// 2. Load URLs to notify Google about
const BASE_URL = 'https://calculhub.in';
const paths = [
  '/',
  '/about',
  '/blog',
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

// 3. Batch Submit URLs to Google Indexing API
async function submitUrls() {
  console.log(`Starting submission of ${urls.length} URLs to Google Indexing API...`);
  
  // Note: Google Indexing API rate limits requests, so we process them sequentially or in batches.
  // Daily default limit is 200 requests per project.
  for (const url of urls) {
    try {
      const response = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      console.log(`Successfully notified Google: ${url} (Status: ${response.status})`);
    } catch (error) {
      console.error(`Failed to notify Google for ${url}:`, error.message);
    }
    // Small delay to prevent hitting rate limits too quickly
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  console.log('Submission task complete.');
}

submitUrls();
