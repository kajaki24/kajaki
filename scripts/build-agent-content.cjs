const fs = require('node:fs/promises');
const path = require('node:path');
const { parse } = require('node-html-parser');
const TurndownService = require('turndown');

// Use rendered pages so CMS edits and price changes reach both representations.
module.exports = async function ({ results, dir }) {
  const converter = new TurndownService({ headingStyle: 'atx' });
  const pages = {};
  for (const result of results) {
    if (!result.outputPath?.endsWith('.html') || !result.url || result.url.startsWith('/admin')) continue;
    const doc = parse(await fs.readFile(result.outputPath, 'utf8'));
    const body = doc.querySelector('body') || doc;
    body.querySelectorAll('script, style, svg, nav, footer, form, iframe, .modal, .hero-main-title, .kayak-wrap').forEach(node => node.remove());
    body.querySelectorAll('a[href], img[src]').forEach(node => {
      const attr = node.tagName === 'A' ? 'href' : 'src';
      const value = node.getAttribute(attr);
      if (value) node.setAttribute(attr, new URL(value, `https://kajaki24.com.pl${result.url}`).href);
    });
    pages[result.url] = converter.turndown(body.innerHTML) + '\n';
  }
  if (!pages['/']) throw new Error('Missing homepage Markdown');
  await fs.mkdir('netlify/edge-functions/generated', { recursive: true });
  await fs.writeFile('netlify/edge-functions/generated/pages.json', JSON.stringify(pages));
  await fs.writeFile(path.join(dir.output, 'llms.txt'), pages['/']);
  await require('./build-discovery.cjs')(dir.output);
};
