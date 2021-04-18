const puppy = require('puppeteer');
// let { text } = require('./data.json');
let text = 'Data Science';

async function main() {
  let browser = await puppy.launch({
    headless: false,
    defaultViewport: false,
    args: ['--start-maximized'],
  });

  let pages = await browser.pages();
  let tab = pages[0];

  await tab.goto('https://www.google.com/');
  await tab.waitForSelector('.gLFyf.gsfi', { visible: true });
  await tab.click('.gLFyf.gsfi');
  await tab.type('.gLFyf.gsfi', text, { delay: 100 });

  await tab.click('.gNO89b');
}

main();
