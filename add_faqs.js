const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, 'src/app/app.routes.ts');
let routesContent = fs.readFileSync(routesPath, 'utf-8');

const calcDirs = fs.readdirSync(path.join(__dirname, 'src/app/Allcalculators'));

let faqMap = {};

calcDirs.forEach(dir => {
  const calcPath = path.join(__dirname, 'src/app/Allcalculators', dir);
  if (!fs.statSync(calcPath).isDirectory()) return;
  
  const files = fs.readdirSync(calcPath);
  const htmlFile = files.find(f => f.endsWith('.html'));
  if (!htmlFile) return;

  const htmlContent = fs.readFileSync(path.join(calcPath, htmlFile), 'utf-8');
  
  const faqSectionMatch = htmlContent.match(/<h2>Frequently Asked Questions<\/h2>\s*<div class="seo-faq">([\s\S]*?)<\/div>\s*<\/div>/);
  if (!faqSectionMatch) return;

  const faqContent = faqSectionMatch[1];
  const items = faqContent.match(/<div class="faq-item">([\s\S]*?)<\/div>/g);
  if (!items) return;

  const faqs = items.map(item => {
    const qMatch = item.match(/<h3>(.*?)<\/h3>/);
    const aMatch = item.match(/<p>(.*?)<\/p>/);
    if (qMatch && aMatch) {
      return {
        question: qMatch[1].trim(),
        answer: aMatch[1].trim()
      };
    }
    return null;
  }).filter(Boolean);

  if (faqs.length > 0) {
    faqMap[dir] = faqs;
  }
});

// Now we need to inject this into app.routes.ts
// Looking for `path: '...',` then `schema: [...]`
// It's probably easier to just replace `schema: [calcSchema(...)]` with `schema: [calcSchema(...), { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [...] }]`

for (const [dir, faqs] of Object.entries(faqMap)) {
  const faqJson = faqs.map(f => `{ '@type': 'Question', name: ${JSON.stringify(f.question)}, acceptedAnswer: { '@type': 'Answer', text: ${JSON.stringify(f.answer)} } }`).join(',\n                ');
  
  const faqString = `,
            {
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: [
                ${faqJson}
              ]
            }`;

  // Find the block for this calculator in routesContent.
  // The route path usually matches the directory name, or we can look for the loadComponent line.
  // Let's look for `${BASE_URL}/financial/${dir}` or `${BASE_URL}/mathematical/${dir}` or `${BASE_URL}/health/${dir}`.
  
  // A regex to find the schema array for the specific calculator.
  const regex = new RegExp(`(calcSchema\\([^)]+\\${dir}[^)]+\\))([\n\\s]*)\\]`, 'g');
  
  routesContent = routesContent.replace(regex, `$1${faqString}$2]`);
}

fs.writeFileSync(routesPath, routesContent);
console.log('Routes updated with FAQ schemas!');
