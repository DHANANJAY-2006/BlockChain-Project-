const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });

  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Hero & Header
  console.log('Capturing 01_hero_navbar.png...');
  await page.screenshot({
    path: path.join(screenshotsDir, '01_hero_navbar.png'),
    clip: { x: 0, y: 0, width: 1440, height: 820 }
  });

  // 2. Initial Verify Section
  console.log('Capturing 02_verify_initial_input.png...');
  const verifyEl = await page.$('#verify');
  if (verifyEl) {
    await verifyEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    const box = await verifyEl.boundingBox();
    await page.screenshot({
      path: path.join(screenshotsDir, '02_verify_initial_input.png'),
      clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 780) }
    });
  }

  // 3. Upload Deepfake Sample File
  console.log('Uploading sample_deepfake_media.png...');
  const deepfakePath = path.join(__dirname, 'sample_deepfake_media.png');
  const fileInput = await page.$('#verify input[type="file"]');
  await fileInput.uploadFile(deepfakePath);
  await new Promise(r => setTimeout(r, 1000));

  console.log('Capturing 03_verify_file_selected.png...');
  const boxSelected = await verifyEl.boundingBox();
  await page.screenshot({
    path: path.join(screenshotsDir, '03_verify_file_selected.png'),
    clip: { x: boxSelected.x, y: boxSelected.y, width: boxSelected.width, height: Math.min(boxSelected.height, 800) }
  });

  // 4. Click Start Blockchain Verification & capture in-progress
  console.log('Starting verification...');
  const verifyBtn = await page.$('#verify button.btn-primary');
  if (verifyBtn) {
    await verifyBtn.click();
  }
  await new Promise(r => setTimeout(r, 1200));

  console.log('Capturing 04_verify_processing.png...');
  const boxProcessing = await verifyEl.boundingBox();
  await page.screenshot({
    path: path.join(screenshotsDir, '04_verify_processing.png'),
    clip: { x: boxProcessing.x, y: boxProcessing.y, width: boxProcessing.width, height: Math.min(boxProcessing.height, 800) }
  });

  // Wait for verification completion
  console.log('Waiting for verification to complete (done state)...');
  await page.waitForFunction(() => {
    return document.body.innerText.includes('DEEPFAKE DETECTED') || document.body.innerText.includes('AUTHENTIC');
  }, { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  console.log('Capturing 05_verify_output_deepfake.png...');
  const boxOutputDf = await verifyEl.boundingBox();
  await page.screenshot({
    path: path.join(screenshotsDir, '05_verify_output_deepfake.png'),
    clip: { x: boxOutputDf.x, y: boxOutputDf.y, width: boxOutputDf.width, height: Math.min(boxOutputDf.height, 900) }
  });

  // 5. Expand Certificate
  console.log('Expanding certificate...');
  const certBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Certificate') || b.innerText.includes('View'));
  });
  if (certBtn && certBtn.click) {
    await certBtn.click();
    await new Promise(r => setTimeout(r, 800));
    console.log('Capturing 06_smart_contract_certificate.png...');
    const boxCert = await verifyEl.boundingBox();
    await page.screenshot({
      path: path.join(screenshotsDir, '06_smart_contract_certificate.png'),
      clip: { x: boxCert.x, y: boxCert.y, width: boxCert.width, height: Math.min(boxCert.height, 1050) }
    });
  }

  // 6. Test Authentic media
  console.log('Resetting and verifying authentic media...');
  const resetBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('#verify button'));
    return btns.find(b => b.innerText.includes('Verify Another') || b.querySelector('svg.lucide-refresh-cw') || b.querySelector('svg.lucide-x'));
  });
  if (resetBtn && resetBtn.click) {
    await resetBtn.click();
    await new Promise(r => setTimeout(r, 500));
  } else {
    // Alternatively refresh the page or click file input directly
    await page.reload({ waitUntil: 'networkidle2' });
  }

  const fileInput2 = await page.$('#verify input[type="file"]');
  const authenticPath = path.join(__dirname, 'sample_authentic_media.png');
  await fileInput2.uploadFile(authenticPath);
  await new Promise(r => setTimeout(r, 800));

  const verifyBtn2 = await page.$('#verify button.btn-primary');
  if (verifyBtn2) await verifyBtn2.click();

  console.log('Waiting for authentic result...');
  await page.waitForFunction(() => {
    return document.body.innerText.includes('AUTHENTIC');
  }, { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  console.log('Capturing 07_verify_output_authentic.png...');
  const verifyElAuth = await page.$('#verify');
  const boxAuth = await verifyElAuth.boundingBox();
  await page.screenshot({
    path: path.join(screenshotsDir, '07_verify_output_authentic.png'),
    clip: { x: boxAuth.x, y: boxAuth.y, width: boxAuth.width, height: Math.min(boxAuth.height, 900) }
  });

  // 7. Compare Section
  console.log('Testing Compare Section...');
  const compareEl = await page.$('#compare');
  if (compareEl) {
    await compareEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));

    const compareInputs = await page.$$('#compare input[type="file"]');
    if (compareInputs.length >= 2) {
      await compareInputs[0].uploadFile(authenticPath);
      await new Promise(r => setTimeout(r, 600));
      await compareInputs[1].uploadFile(deepfakePath);
      await new Promise(r => setTimeout(r, 1200));

      console.log('Capturing 08_compare_hashes_avalanche.png...');
      const boxCompare = await compareEl.boundingBox();
      await page.screenshot({
        path: path.join(screenshotsDir, '08_compare_hashes_avalanche.png'),
        clip: { x: boxCompare.x, y: boxCompare.y, width: boxCompare.width, height: Math.min(boxCompare.height, 850) }
      });
    }
  }

  // 8. Blockchain Section & Consensus Terminal
  console.log('Testing Blockchain Section & Consensus Terminal...');
  const bcEl = await page.$('#blockchain');
  if (bcEl) {
    await bcEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 2000)); // allow terminal logs to accumulate

    console.log('Capturing 09_consensus_terminal_and_blocks.png...');
    const boxBc = await bcEl.boundingBox();
    await page.screenshot({
      path: path.join(screenshotsDir, '09_consensus_terminal_and_blocks.png'),
      clip: { x: boxBc.x, y: boxBc.y, width: boxBc.width, height: Math.min(boxBc.height, 1050) }
    });
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
