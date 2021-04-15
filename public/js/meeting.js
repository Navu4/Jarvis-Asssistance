const puppy = require('puppeteer');

let { emailId, pwd } = require('./myInfo.json');
let {meetingType } = require('./meetingInfo.json')

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
      "https://apps.google.com/meet/"
    );
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
    let waitPromise = tab.waitForSelector("a[event-action='sign in']", { visible: true });
    return waitPromise;
  })
  .then(function () {
    let allclassPromise = tab.click("a[event-action='sign in']"); // click on email button
    return allclassPromise;
  })
  .then(function () {
    let waitIdPromise = tab.waitForSelector("#identifierId", {visible : true});
    return waitIdPromise;
  })
  .then(function () {
    let clickIdPromise = tab.click("#identifierId");
    return clickIdPromise;
  })
  .then(function () {
    let idPromise = tab.type("#identifierId", emailId); // type email ID
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
    let waitForMeeting = tab.waitForSelector(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.cjtUbb.Dg7t5c" ,{visible: true});
    return waitForMeeting
  })
  .then(function () {
    let googleAppsbtn = tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.cjtUbb.Dg7t5c");
    return googleAppsbtn;
  })
  .then(function () {
    let arrayOfMeetingType = tab.$$(".VfPpkd-StrnGf-rymPhb.DMZ54e li");
    return arrayOfMeetingType;
  })
  .then(function (listOfMeetingType) {
    // console.log(listOfMeetingType.length);
    for(let i in listOfMeetingType){
      if(meetingType == 'instant' && i == 1){
        let instantMeetingPromise = tab.evaluate(function (ele) {
          return ele.click();
        }, listOfMeetingType[1]);
        return instantMeetingPromise;
      } else if(meetingType == 'later' && i == 0){
        let laterMeetingPromise = tab.evaluate(function (ele) {
          return ele.click();
        }, listOfMeetingType[0]);
        return laterMeetingPromise;
      } else if(meetingType == 'schedule' && i == 2){
        let scheduleMeetingPromise = tab.evaluate(function (ele) {
          return ele.click();
        },listOfMeetingType[2]);
        return scheduleMeetingPromise;
      }
    }
  })
  .then(function(){
    if(meetingType == 'schedule'){
      let pages = brow.pages;
      console.log(pages.length);
    }
  })
  .catch(function (err) {
    console.log(err);
  });