// imports
const puppy = require('puppeteer');
// const fs = require('fs');
const express = require('express');
const { REPL_MODE_SLOPPY } = require('repl');
const app = express();
const port = 3000;

// Static Files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/meeting', (req, res, next) => {
  let { emailId, pwd } = require('./public/data/myInfo.json');
  let { meetingType } = require('./public/data/meetingData.json');

  console.log('entered!!!!');

  function main() {
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
        let pageOpenPromise = tab.goto('https://apps.google.com/meet/');
        return pageOpenPromise;
      })
      .then(function () {
        new Promise(function (resolve, reject) {
          // Asynchronous setTimeout function
          setTimeout(() => {
            resolve();
          }, 5000);
        });
      })
      .then(function () {
        let waitPromise = tab.waitForSelector("a[event-action='sign in']", {
          visible: true,
        });
        return waitPromise;
      })
      .then(function () {
        let allclassPromise = tab.click("a[event-action='sign in']"); // click on email button
        return allclassPromise;
      })
      .then(function () {
        let waitIdPromise = tab.waitForSelector('#identifierId', {
          visible: true,
        });
        return waitIdPromise;
      })
      .then(function () {
        let clickIdPromise = tab.click('#identifierId');
        return clickIdPromise;
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
        return new Promise(function (resolve, reject) {
          // Asynchronous setTimeout function
          setTimeout(() => {
            resolve();
          }, 3000);
        });
      })
      .then(function () {
        let waitForMeeting = tab.waitForSelector(
          '.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.cjtUbb.Dg7t5c',
          { visible: true }
        );
        return waitForMeeting;
      })
      .then(function () {
        let googleAppsbtn = tab.click(
          '.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.cjtUbb.Dg7t5c'
        );
        return googleAppsbtn;
      })
      .then(function () {
        let arrayOfMeetingType = tab.$$('.VfPpkd-StrnGf-rymPhb.DMZ54e li');
        return arrayOfMeetingType;
      })
      .then(function (listOfMeetingType) {
        // console.log(listOfMeetingType.length);
        for (let i in listOfMeetingType) {
          if (meetingType == 'instant' && i == 1) {
            let instantMeetingPromise = tab.evaluate(function (ele) {
              return ele.click();
            }, listOfMeetingType[1]);
            return instantMeetingPromise;
          } else if (meetingType == 'later' && i == 0) {
            let laterMeetingPromise = tab.evaluate(function (ele) {
              return ele.click();
            }, listOfMeetingType[0]);
            return laterMeetingPromise;
          } else if (meetingType == 'schedule' && i == 2) {
            let scheduleMeetingPromise = tab.evaluate(function (ele) {
              return ele.click();
            }, listOfMeetingType[2]);
            return scheduleMeetingPromise;
          }
        }
      })
      .then(function () {
        if (meetingType == 'schedule') {
          let pages = brow.pages;
          console.log(pages.length);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  main();
});

app.post('/sendmail', (req, res, next) => {
  //   console.log(localStorage.getItem('data'));
  //   const { senderEmailId, mailSubject, mailText } = req.body;
  let { emailId, pwd } = require('./public/data/myInfo.json');
  let {
    senderEmailId,
    mailSubject,
    mailText,
  } = require('./public/data/senderDetails.json');

  function main() {
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
        let toTypePromise = tab.type('.wO.nr.l1', senderEmailId, {
          delay: 200,
        }); //type the mail id of the receipient
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
        let textAreaPromise = tab.type(
          '.Am.Al.editable.LW-avf.tS-tW',
          mailText,
          {
            delay: 300,
          }
        ); // getting the text from Json file for typing message in compose-mail box
        return textAreaPromise;
      })
      .then(function () {
        let sendPromise = tab.click('.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3'); // click on send button
        return sendPromise;
      })
      .then(function () {
        let waitIdPromise = tab.waitForSelector('.gb_Da.gbii', {
          visible: true,
        });
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

  main();
});
// Listen on port 3000
app.listen(port, () => console.log(`listening on port ${port}`));
