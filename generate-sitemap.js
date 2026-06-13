const fs = require('fs');

const paths = [
  '/',
  '/about',
  '/blog',
  '/sitemap',
  '/other',
  '/financial/mortgage',
  '/financial/compound-interest',
  '/financial/gst-calculator',
  '/financial/sip-calculator',
  '/financial/fd-calculator',
  '/financial/tax-calculator',
  '/financial/mutual-fund-calculator',
  '/financial/ppf-calculator',
  '/financial/loan-eligibility-calculator',
  '/financial/home-loan-emi-calculator',
  '/financial/retirement-calculator',
  '/financial/investment-calculator',
  '/financial/bike-loan-emi-calculator',
  '/financial/education-loan-emi-calculator',
  '/mathematical/percentage-calculator',
  '/mathematical/scientific-calculator',
  '/mathematical/algebra-calculator',
  '/mathematical/matrix-calculator',
  '/mathematical/statistics-calculator',
  '/health/calorie-calculator',
  '/health/bmi-calculator',
  '/health/body-fat-calculator',
  '/health/ideal-weight-calculator',
  '/health/bmr-tdee-calculator',
  '/market/currency-converter',
  '/market/crypto-calculator',
  '/market/gold-silver-calculator',
  '/privacy-policy',
  '/terms',
  '/contact'
];

const BASE_URL = 'https://calcul-hub.vercel.app';
const date = new Date().toISOString();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(path => `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${path === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${path === '/' ? '1.0' : path.split('/').length === 2 ? '0.9' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log('sitemap.xml created');

const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync('public/robots.txt', robots);
console.log('robots.txt created');
