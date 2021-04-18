const puppy = require('puppeteer');
// let { text } = require('./data.json');
let text = "Data Science";

async function main() {
  let browser = await puppy.launch({
    headless: false,
    defaultViewport: false,
    args: ['--start-maximized'],
  });

  let pages = await browser.pages();
  let tab = pages[0];

  await tab.goto("https://youtube.com/");
  await tab.waitForSelector("#search.ytd-searchbox", {visible : true});
  await tab.click("#search.ytd-searchbox");
  await tab.type("#search.ytd-searchbox", text, { delay : 50});

  await tab.click("#search-icon-legacy.style-scope.ytd-searchbox");
}

main();