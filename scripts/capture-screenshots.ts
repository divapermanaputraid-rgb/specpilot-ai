import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

const DEMO_SESSION_ID = 'demo-flexivision-session';
const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(process.cwd(), 'assets', 'screenshots');

// Viewport configuration
const VIEWPORT = {
  width: 1440,
  height: 1100,
};

async function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

async function captureScreenshots() {
  console.log('🚀 Starting screenshot capture...');
  console.log(`📍 Using session ID: ${DEMO_SESSION_ID}`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('');

  // Ensure screenshots directory exists
  ensureDirectoryExists(SCREENSHOTS_DIR);

  // Launch browser
  console.log('🌍 Launching Chromium browser...');
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  try {
    // 1. Capture Homepage
    console.log('📸 Capturing homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // Wait for animations
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'homepage.png'),
      fullPage: true,
    });
    console.log('✅ Saved: homepage.png');

    // 2. Capture Idea Input Page
    console.log('📸 Capturing idea input page...');
    await page.goto(`${BASE_URL}/app`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // Wait for animations
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'idea-input.png'),
      fullPage: false, // Keep viewport size
    });
    console.log('✅ Saved: idea-input.png');

    // 3. Capture Interview Flow
    console.log('📸 Capturing interview flow...');
    await page.goto(`${BASE_URL}/app/session/${DEMO_SESSION_ID}`, {
      waitUntil: 'networkidle',
    });
    
    // Wait for the interview content to load
    await page.waitForSelector('[data-testid="interview-question"], .text-xl', {
      timeout: 10000,
    }).catch(() => {
      console.log('⚠️  Interview question selector not found, capturing anyway...');
    });
    
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'interview-flow.png'),
      fullPage: false,
    });
    console.log('✅ Saved: interview-flow.png');

    // 4. Capture PRD Result Page
    console.log('📸 Capturing PRD result page...');
    await page.goto(`${BASE_URL}/prd/${DEMO_SESSION_ID}`, {
      waitUntil: 'networkidle',
    });
    
    // Wait for PRD content to render
    await page.waitForSelector('article, .prose, h1', {
      timeout: 10000,
    }).catch(() => {
      console.log('⚠️  PRD content selector not found, capturing anyway...');
    });
    
    await page.waitForTimeout(2000); // Wait for Mermaid diagrams to render
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'prd-result.png'),
      fullPage: true,
    });
    console.log('✅ Saved: prd-result.png');

    console.log('');
    console.log('🎉 All screenshots captured successfully!');
    console.log(`📂 Screenshots saved to: ${SCREENSHOTS_DIR}`);
    console.log('');
    console.log('Screenshots:');
    console.log(`  - ${path.join(SCREENSHOTS_DIR, 'homepage.png')}`);
    console.log(`  - ${path.join(SCREENSHOTS_DIR, 'idea-input.png')}`);
    console.log(`  - ${path.join(SCREENSHOTS_DIR, 'interview-flow.png')}`);
    console.log(`  - ${path.join(SCREENSHOTS_DIR, 'prd-result.png')}`);
  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('🔒 Browser closed.');
  }
}

// Check if dev server is running
async function checkDevServer() {
  console.log('🔍 Checking if dev server is running...');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    if (response.ok) {
      console.log('✅ Dev server is running!');
      console.log('');
      return true;
    }
  } catch (error) {
    console.error('❌ Dev server is not running!');
    console.error('');
    console.error('Please start the dev server first:');
    console.error('  pnpm dev');
    console.error('');
    console.error('Then run this script again:');
    console.error('  pnpm capture:screenshots');
    console.error('');
    return false;
  }
  return false;
}

async function main() {
  const isServerRunning = await checkDevServer();
  if (!isServerRunning) {
    process.exit(1);
  }

  await captureScreenshots();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});