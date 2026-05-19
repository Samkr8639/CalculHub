const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') && !file.includes('.spec.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src/app/Allcalculators');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('chart.js')) return;
  
  let modified = false;

  // Add PLATFORM_ID to components that still need it (my first script might have missed some)
  if (!content.includes('private platformId = inject(PLATFORM_ID);')) {
    content = content.replace(/(export class [^\s]+(?:[\s\S]*?)implements[^{]+|\bexport class [^\s]+[\s]*)\{/, match => {
      return match + `\n  private platformId = inject(PLATFORM_ID);\n`;
    });
    modified = true;
  }

  // Find the function that creates the chart
  const createChartRegex = /(createChart|initChart|renderChart)\s*\(\)\s*\{/;
  if (createChartRegex.test(content)) {
    // Check if it already has the platform check immediately after
    if (!content.includes('if (!isPlatformBrowser(this.platformId)) return;')) {
      content = content.replace(createChartRegex, match => {
        return match + `\n    if (!isPlatformBrowser(this.platformId)) return;\n`;
      });
      modified = true;
    } else {
      // It has the check somewhere, let's make sure it's in the creation function
      // Actually, if it has it ANYWHERE, the first script added it. But did the first script add it to updateChart and miss createChart?
      // Let's force replace it ONLY if it's missing in the function body.
      // Easiest way: just replace it if it's not immediately following.
      const matchPos = content.search(createChartRegex);
      const funcBody = content.substring(matchPos, matchPos + 100);
      if (!funcBody.includes('isPlatformBrowser')) {
        content = content.replace(createChartRegex, match => {
          return match + `\n    if (!isPlatformBrowser(this.platformId)) return;\n`;
        });
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
});
