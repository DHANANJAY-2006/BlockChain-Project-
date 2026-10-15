const puppeteer = require('puppeteer-core');
const path = require('path');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 2 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const verifyEl = await page.$('#verify');
  await verifyEl.scrollIntoView();

  const fileInput = await page.$('#verify input[type="file"]');
  await fileInput.uploadFile(path.join(__dirname, 'sample_authentic_media.png'));
  await new Promise(r => setTimeout(r, 600));

  const verifyBtn = await page.$('#verify button.btn-primary');
  if (verifyBtn) await verifyBtn.click();

  await page.waitForFunction(() => document.body.innerText.includes('AUTHENTIC'), { timeout: 15000 });
  await new Promise(r => setTimeout(r, 800));

  // Click the View Blockchain Certificate button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Blockchain Certificate'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  const box = await verifyEl.boundingBox();
  await page.screenshot({
    path: path.join(__dirname, 'screenshots', '06_smart_contract_certificate.png'),
    clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 1200) }
  });

  console.log('06_smart_contract_certificate.png captured successfully!');
  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
