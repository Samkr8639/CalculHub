#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const root = path.resolve(__dirname, '..');
const dryRun = process.argv.includes('--dry-run');
const apply = process.argv.includes('--apply');

function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, data) { fs.writeFileSync(file, data, 'utf8'); }

function findComponentHtmls() {
  return glob.sync(path.join(root, 'src', 'app', '**', '*.component.html'))
    .concat(glob.sync(path.join(root, 'src', 'app', '**', '*.html')))
    .filter(p => p.indexOf('node_modules') === -1);
}

function stripTags(s) { return s.replace(/<[^>]+>/g, ''); }

function processFile(file) {
  const original = read(file);
  let content = original;
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  let changed = false;
  if (h1Match) {
    const h1text = stripTags(h1Match[1]).trim();
    if (h1text && !/\{\{/.test(h1Match[1])) {
      // check if any of H1 words appear elsewhere
      const words = h1text.split(/\s+/).map(w => w.replace(/[^a-zA-Z0-9]/g, ''))
        .filter(Boolean);
      const rest = content.replace(h1Match[0], '');
      const restLower = rest.toLowerCase();
      const present = words.some(w => restLower.includes(w.toLowerCase()));
      if (!present) {
        const insert = `\n<p class="auto-seo">${h1text} — Learn more about ${h1text} and how it helps you get accurate results.</p>\n`;
        content = content.replace(h1Match[0], h1Match[0] + insert);
        changed = true;
      }
    }
  }

  // report duplicate anchor texts
  const anchorRegex = /<a[^>]*>([\s\S]*?)<\/a>/gi;
  const anchors = [];
  let a;
  while ((a = anchorRegex.exec(content)) !== null) {
    const fullTag = a[0];
    // ignore clones/hidden items that are marked for looping or nofollow
    if (/aria-hidden\s*=\s*['"]true['"]|data-clone|rel\s*=\s*['"][^'"]*nofollow[^'"]*['"]/i.test(fullTag)) continue;
    const text = stripTags(a[1]).trim();
    // ignore template bindings like {{ card.title }} for duplicate-text checks
    if (text.includes('{{') || text.includes('}}')) continue;
    anchors.push(text);
  }
  const dupes = anchors.reduce((acc, t) => {
    if (!t) return acc;
    const key = t.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const duplicates = Object.entries(dupes).filter(([k,v]) => v>1);

  // word count
  const wordCount = stripTags(content).split(/\s+/).filter(Boolean).length;

  return { file, changed, content, duplicates, wordCount };
}

function main() {
  const files = findComponentHtmls();
  const results = files.map(processFile);
  const toWrite = results.filter(r => r.changed && r.content !== read(r.file));

  console.log(`Scanned ${files.length} files.`);
  results.forEach(r => {
    if (r.duplicates.length) {
      console.log(`Duplicate anchors in ${path.relative(root, r.file)}:`);
      r.duplicates.forEach(d => console.log(`  "${d[0]}" × ${d[1]}`));
    }
    if (r.wordCount < 800) {
      console.log(`Word count ${r.wordCount} in ${path.relative(root, r.file)} (recommended ~800).`);
    }
    if (r.changed) console.log(`Suggestion: insert H1-sentence in ${path.relative(root, r.file)}`);
  });

  // Optional JSON report
  const shouldReport = process.argv.includes('--report');
  if (shouldReport) {
    const report = {
      scanned: files.length,
      lowWordCount: results.filter(r => r.wordCount < 800).map(r => ({ file: path.relative(root, r.file), wordCount: r.wordCount })),
      duplicateAnchors: results.filter(r => r.duplicates.length).map(r => ({ file: path.relative(root, r.file), duplicates: r.duplicates })),
      h1Suggestions: results.filter(r => r.changed).map(r => ({ file: path.relative(root, r.file) })),
    };
    write(path.join(root, 'tools', 'seo-report.json'), JSON.stringify(report, null, 2));
    console.log(`Wrote JSON report to tools/seo-report.json`);
  }

  if (toWrite.length) {
    if (dryRun) {
      console.log('\nDry-run mode: no files will be modified. Use --apply to write changes.');
      toWrite.forEach(r => console.log(`Would modify: ${path.relative(root, r.file)}`));
    } else if (apply) {
      toWrite.forEach(r => {
        write(r.file, r.content);
        console.log(`Modified: ${path.relative(root, r.file)}`);
      });
    } else {
      console.log('\nRun with --apply to write suggested changes, or --dry-run to preview.');
    }
  } else {
    console.log('No automatic changes suggested.');
  }
}

main();
