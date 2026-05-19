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
  if (!content.includes('Chart.register')) return;
  
  let modified = false;

  // 1. Remove Chart.register from top level (usually right after imports)
  // Be careful not to remove it if it's already inside a method.
  // We can just replace any instance that has no leading indentation.
  if (/^Chart\.register/m.test(content)) {
    content = content.replace(/^Chart\.register.*$/gm, '');
    modified = true;
  }
  
  // Also remove if it's in constructor without browser check, though it's less harmful.
  // But wait, the error is likely due to 'chart.js/auto' or 'chart.js' being imported.
  // But actually, just moving Chart.register might be enough.
  
  // 2. Put it inside createChart / renderChart right after the platform check
  if (modified) {
    const createChartRegex = /(createChart|initChart|renderChart)\s*\(\)\s*\{\s*if \(!isPlatformBrowser\(this\.platformId\)\) return;/g;
    
    // Check if it already has Chart.register inside
    if (!content.includes('    Chart.register(...registerables);')) {
      content = content.replace(createChartRegex, match => {
        return match + `\n    Chart.register(...registerables);`;
      });
    }
    
    fs.writeFileSync(file, content);
    console.log(`Fixed Chart.register in ${file}`);
  }
});
