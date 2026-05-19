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
  
  // Only process files that use Chart.js
  if (!content.includes('chart.js')) {
    return;
  }
  
  let modified = false;

  // 1. Ensure PLATFORM_ID and inject are imported from @angular/core
  if (content.includes('@angular/core') && (!content.includes('PLATFORM_ID') || !content.includes('inject'))) {
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]@angular\/core['"];/, (match, p1) => {
      let imports = p1.split(',').map(s => s.trim()).filter(Boolean);
      if (!imports.includes('PLATFORM_ID')) imports.push('PLATFORM_ID');
      if (!imports.includes('inject')) imports.push('inject');
      return `import { ${imports.join(', ')} } from '@angular/core';`;
    });
    modified = true;
  }

  // 2. Ensure isPlatformBrowser is imported from @angular/common
  if (content.includes('@angular/common') && !content.includes('isPlatformBrowser')) {
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]@angular\/common['"];/, (match, p1) => {
      let imports = p1.split(',').map(s => s.trim()).filter(Boolean);
      if (!imports.includes('isPlatformBrowser')) imports.push('isPlatformBrowser');
      return `import { ${imports.join(', ')} } from '@angular/common';`;
    });
    modified = true;
  } else if (!content.includes('@angular/common')) {
    content = `import { isPlatformBrowser } from '@angular/common';\n` + content;
    modified = true;
  }

  // 3. Inject PLATFORM_ID in the class
  if (!content.includes('private platformId = inject(PLATFORM_ID);')) {
    content = content.replace(/(export class [^\s]+(?:[\s\S]*?)implements[^{]+|\bexport class [^\s]+[\s]*)\{/, match => {
      return match + `\n  private platformId = inject(PLATFORM_ID);\n`;
    });
    modified = true;
  }

  // 4. Wrap renderChart()
  if (content.includes('renderChart()') && !content.includes('!isPlatformBrowser(this.platformId)')) {
    // some files might have renderChart() without space, some with space
    content = content.replace(/(renderChart|initChart|createChart)\s*\(\)\s*\{/, match => {
      return match + `\n    if (!isPlatformBrowser(this.platformId)) return;\n`;
    });
    modified = true;
  }

  // 5. Wrap updateChart()
  if (content.includes('updateChart()') && !content.includes('!isPlatformBrowser(this.platformId)')) {
    content = content.replace(/updateChart\s*\(\)\s*\{/, `updateChart() {\n    if (!isPlatformBrowser(this.platformId)) return;\n`);
    modified = true;
  }

  // Also check if any file has ngAfterViewInit that directly does something with Chart
  // Some files might just be doing this.createChart()
  
  if (modified) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
