// Imprime o catalogo.html (tools/gera-catalogo-pdf.py) em PDF A4 com o Chromium do Playwright.
// Uso: NODE_PATH=$(npm root -g) node tools/catalogo-pdf.js <catalogo.html> <saída.pdf>
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const [src, out] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(src), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
  console.log(out);
})();
