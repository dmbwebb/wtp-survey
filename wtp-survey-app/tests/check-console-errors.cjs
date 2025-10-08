const { Builder, Browser, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function checkConsoleErrors() {
  console.log('🔄 Killing any existing dev servers...');
  try {
    await execAsync('pkill -f "vite"');
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (e) {
    // Ignore if no process found
  }

  console.log('🔄 Clearing caches...');
  await execAsync('cd "' + process.cwd() + '" && rm -rf node_modules/.vite .vite');

  console.log('🔧 Starting dev server...');
  const serverProcess = exec('cd "' + process.cwd() + '" && npm run dev');

  // Wait for server to be ready
  console.log('⏳ Waiting for server to start...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  // Set up Chrome options
  const options = new chrome.Options();
  options.addArguments('--headless'); // Run in headless mode
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  let driver;

  try {
    console.log('Starting Chrome browser...');
    driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .build();

    const testUrl = 'http://localhost:5173/';
    console.log(`Navigating to ${testUrl}...`);

    // Enable console log collection
    await driver.manage().logs();

    // Navigate to the app
    await driver.get(testUrl);

    // Wait for page to load (wait for body element)
    console.log('Waiting for page to load...');
    await driver.wait(until.elementLocated(By.css('body')), 10000);

    // Wait a bit for any dynamic content to load
    await driver.sleep(2000);

    // Get browser logs
    console.log('Checking browser console logs...');
    const logs = await driver.manage().logs().get('browser');

    // Filter for errors
    const errors = logs.filter(entry =>
      entry.level.name === 'SEVERE' ||
      entry.message.includes('error') ||
      entry.message.includes('Error') ||
      entry.message.includes('Uncaught')
    );

    // Print all logs for debugging
    console.log('\n=== ALL CONSOLE LOGS ===');
    logs.forEach(entry => {
      console.log(`[${entry.level.name}] ${entry.message}`);
    });

    // Report errors
    console.log('\n=== ERROR SUMMARY ===');
    if (errors.length > 0) {
      console.log(`❌ Found ${errors.length} error(s) in console:\n`);
      errors.forEach((entry, index) => {
        console.log(`Error ${index + 1}:`);
        console.log(`  Level: ${entry.level.name}`);
        console.log(`  Message: ${entry.message}`);
        console.log('');
      });
      process.exit(1);
    } else {
      console.log('✅ No errors found in console!');

      // Check if page has expected content
      const pageSource = await driver.getPageSource();
      if (pageSource.includes('Participant ID') || pageSource.includes('Welcome')) {
        console.log('✅ Page loaded with expected content!');
      } else {
        console.log('⚠️  Page loaded but expected content not found');
      }

      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    serverProcess.kill();
    process.exit(1);
  } finally {
    if (driver) {
      await driver.quit();
    }
    console.log('\n🛑 Stopping dev server...');
    serverProcess.kill();
  }
}

// Run the test
checkConsoleErrors();
