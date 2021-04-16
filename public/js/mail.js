const puppy = require('puppeteer');

let { emailId, pwd } = require('./myInfo.json');
let { senderEmailId, mailSubject, mailText } = require('./senderDetials.json');

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
  await tab.goto(
    'https://accounts.google.com/ServiceLogin/identifier?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin'
  );
  
//   await tab.waitForNavigation({waitUntil:"networkidle0"});
  await tab.waitForSelector('.whsOnd.zHQkBf ', { visible: true });
  await tab.click('.whsOnd.zHQkBf'); // click on email button
  await tab.type('#identifierId', emailId); // type email ID
//   await timeout(3000);
  await tab.click('.VfPpkd-RLmnJb'); // Click on the next button
  await timeout(3000);
  await tab.click('.whsOnd.zHQkBf'); // click on password
  await tab.type('.whsOnd.zHQkBf', pwd); // type the password
  await tab.click('.VfPpkd-RLmnJb'); // Click on the next sign in button
  await tab.waitForSelector('.T-I.T-I-KE.L3');
  await tab.click('.T-I.T-I-KE.L3');
  await timeout(5000);
  await tab.waitForSelector('.wO.nr.l1', { visible: true }); // after clicking on compose waiting for box to appear
  await tab.click('.wO.nr.l1'); // after box will appear click on To/Receipient
  await tab.type('.wO.nr.l1', senderEmailId, { delay: 200 }); //type the mail id of the receipient
  await tab.keyboard.press('Enter'); //by clicking enter it will be selected
  await tab.click('.aoT'); // this is for subject cc
  await tab.type('.aoT', mailSubject, { delay: 100 }); //  type the message in subject / cc
  await tab.click('.Am.Al.editable.LW-avf.tS-tW'); // click on the text area where we need to type our message
  await tab.type('.Am.Al.editable.LW-avf.tS-tW', mailText, {
    delay: 300,
  }); // getting the text from Json file for typing message in compose-mail box
  await tab.click('.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3'); // click on send button
  await tab.waitForSelector('.gb_Da.gbii', { visible: true });
  await  tab.click('.gb_Da.gbii');
  await timeout(7000);
  await tab.click('.gb_Db.gb_Vf.gb_4f.gb_Re.gb_4c'); // clicking on signout
  await browser.close();
}

main();