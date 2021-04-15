const puppy = require('puppeteer');

function main() {
  let { emailId, pwd } = require('.//myInfo.json');
  // let {
  //   senderEmailId,
  //   mailSubject,
  //   mailText,
  // } = require('./senderDetials.json');

  const mydata = JSON.parse(localStorage.data);
  const { senderEmailId, mailSubject, mailText } = mydata;

  let tab; // Working tab of the browser
  let browserPromise = puppy.launch({
    headless: false,
    defaultViewport: false,
    args: ['--start-maximized'],
  });

  let brow;
  browserPromise
    .then(function (browser) {
      brow = browser;
      let pagesPromise = browser.pages();
      return pagesPromise;
    })
    .then(function (pages) {
      tab = pages[0];
      // Open the login page of gmail
      let pageOpenPromise = tab.goto(
        'https://accounts.google.com/ServiceLogin/identifier?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin'
      );
      return pageOpenPromise;
    })
    .then(function () {
      let waitPromise = tab.waitForSelector('.whsOnd.zHQkBf ', {
        visible: true,
      });
      return waitPromise;
    })
    .then(function () {
      let allclassPromise = tab.click('.whsOnd.zHQkBf'); // click on email button
      return allclassPromise;
    })
    .then(function () {
      let idPromise = tab.type('#identifierId', emailId); // type email ID
      return idPromise;
    })
    .then(function () {
      let nextbtnPromise = tab.click('.VfPpkd-RLmnJb'); // Click on the next button
      return nextbtnPromise;
    })
    .then(function () {
      return new Promise(function (resolve, reject) {
        // Asynchronous setTimeout function
        setTimeout(() => {
          resolve();
        }, 3000);
      });
    })
    .then(function () {
      let pwdclassPromise = tab.click('.whsOnd.zHQkBf'); // click on password
      return pwdclassPromise;
    })
    .then(function () {
      let pwdPromise = tab.type('.whsOnd.zHQkBf', pwd); // type the password
      return pwdPromise;
    })
    .then(function () {
      let nextbtnPromise = tab.click('.VfPpkd-RLmnJb'); // Click on the next sign in button
      return nextbtnPromise;
    })
    .then(function () {
      let composeMailWaitPromise = tab.waitForSelector('.T-I.T-I-KE.L3');
      return composeMailWaitPromise;
    })
    .then(function () {
      let composeMailPromise = tab.click('.T-I.T-I-KE.L3');
      return composeMailPromise;
    })
    .then(function () {
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          resolve();
        }, 5000);
      });
    })
    .then(function () {
      let toWaitPrimise = tab.waitForSelector('.wO.nr.l1', { visible: true }); // after clicking on compose waiting for box to appear
      return toWaitPrimise;
    })
    .then(function () {
      let toPromise = tab.click('.wO.nr.l1'); // after box will appear click on To/Receipient
      return toPromise;
    })
    .then(function () {
      let toTypePromise = tab.type('.wO.nr.l1', senderEmailId, { delay: 200 }); //type the mail id of the receipient
      return toTypePromise;
    })
    .then(function () {
      let enterPromise = tab.keyboard.press('Enter'); //by clicking enter it will be selected
      return enterPromise;
    })
    .then(function () {
      let subjectclickPromise = tab.click('.aoT'); // this is for subject cc
      return subjectclickPromise;
    })
    .then(function () {
      let subjectPromise = tab.type('.aoT', mailSubject, { delay: 100 }); //  type the message in subject / cc
      return subjectPromise;
    })
    .then(function () {
      let textAreaClickPromise = tab.click('.Am.Al.editable.LW-avf.tS-tW'); // click on the text area where we need to type our message
      return textAreaClickPromise;
    })
    .then(function () {
      let textAreaPromise = tab.type('.Am.Al.editable.LW-avf.tS-tW', mailText, {
        delay: 300,
      }); // getting the text from Json file for typing message in compose-mail box
      return textAreaPromise;
    })
    .then(function () {
      let sendPromise = tab.click('.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3'); // click on send button
      return sendPromise;
    })
    .then(function () {
      let waitIdPromise = tab.waitForSelector('.gb_Da.gbii', { visible: true });
      return waitIdPromise;
    })
    .then(function () {
      let profilePromise = tab.click('.gb_Da.gbii');
      return profilePromise;
    })
    .then(function () {
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          resolve();
        }, 7000);
      }); // waiting for completion of sending file
    })
    .then(function () {
      let signoutPromise = tab.click('.gb_Db.gb_Vf.gb_4f.gb_Re.gb_4c'); // clicking on signout
      return signoutPromise;
    })
    .catch(function (err) {
      console.log(err);
    });
}
