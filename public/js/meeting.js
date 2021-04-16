const puppy = require('puppeteer');

let { emailId, pwd } = require('./myInfo.json');
let { meetingType } = require('./meetingInfo.json');

async function timeout(time) {
  return new Promise(function (resolve, reject) {
    // Asynchronous setTimeout function
    setTimeout(() => {
      resolve();
    }, time);
  });
}

async function main() {
  let browser = await puppy.launch({
    headless: false,
    defaultViewport: false,
    args: ['--start-maximized'],
  });

  let pages = await browser.pages();
  let tab = pages[0];
  await tab.goto('https://apps.google.com/meet/');
  await timeout(5000);
  await tab.waitForSelector("a[event-action='sign in']", { visible: true });
  await tab.click("a[event-action='sign in']"); // click on email button
  await tab.waitForSelector('#identifierId', { visible: true });
  await tab.click('#identifierId');
  await tab.type('#identifierId', emailId); // type email ID
  await tab.click('.VfPpkd-RLmnJb'); // Click on the next button
  await timeout(3000);
  await tab.click('.whsOnd.zHQkBf'); // click on password
  await tab.type('.whsOnd.zHQkBf', pwd, {
    delay: 300,
  }); // type the password
  await tab.click('.VfPpkd-RLmnJb'); // Click on the next sign in button
  await timeout(3000);
  await tab.waitForSelector(
    '.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.cjtUbb.Dg7t5c',
    { visible: true }
  );
  await tab.click(
    '.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.cjtUbb.Dg7t5c'
  );
  let listOfMeetingType = await tab.$$('.VfPpkd-StrnGf-rymPhb.DMZ54e li');
  console.log(listOfMeetingType.length);
  await listOfMeetingType[1].click();
  
}

main();
