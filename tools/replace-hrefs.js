const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../src/app/Allcalculators');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}

const allFiles = getFiles(baseDir);
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));

let tsFixedCount = 0;

for (const htmlFile of htmlFiles) {
  let htmlContent = fs.readFileSync(htmlFile, 'utf8');
  
  if (htmlContent.includes('routerLink=')) {
    const dir = path.dirname(htmlFile);
    const filesInDir = fs.readdirSync(dir);
    const tsFile = filesInDir.find(f => f.endsWith('.ts') && !f.endsWith('.spec.ts'));
    
    if (tsFile) {
      const tsPath = path.join(dir, tsFile);
      let tsContent = fs.readFileSync(tsPath, 'utf8');
      let tsModified = false;
      
      // 1. Add import statement if not present
      if (!tsContent.includes('RouterLink') && !tsContent.includes('@angular/router')) {
        tsContent = `import { RouterLink } from '@angular/router';\n` + tsContent;
        tsModified = true;
      } else if (!tsContent.includes('RouterLink') && tsContent.includes('@angular/router')) {
        // Add RouterLink to existing @angular/router import
        tsContent = tsContent.replace(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]@angular\/router['"];/, (match, p1) => {
          return `import { ${p1.trim()}, RouterLink } from '@angular/router';`;
        });
        tsModified = true;
      }
      
      // 2. Add RouterLink to imports array in @Component
      const importsRegex = /imports\s*:\s*\[([^\]]+)\]/;
      if (importsRegex.test(tsContent)) {
        tsContent = tsContent.replace(importsRegex, (match, p1) => {
          if (!p1.includes('RouterLink')) {
            const trimmed = p1.trim();
            if (trimmed.endsWith(',')) {
              return `imports: [${p1}RouterLink, ]`;
            } else {
              return `imports: [${p1}, RouterLink]`;
            }
          }
          return match;
        });
        tsModified = true;
      }
      
      if (tsModified) {
        fs.writeFileSync(tsPath, tsContent, 'utf8');
        console.log(`Fixed TS: ${tsPath}`);
        tsFixedCount++;
      }
    }
  }
}

console.log(`Successfully fixed TS imports for ${tsFixedCount} components!`);
