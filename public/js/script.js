// const puppy = require('puppeteer');
// const fs = require('fs')
const btn = document.getElementById('btn');
// const mailing = require('./mail');

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

// Start
function startListening() {
  let recog = new SpeechRecognition();
  recog.start();
  recog.onstart = console.log('Started Listening .. ');

  recog.onresult = function (data) {
    handleResults(data);
  };
}

function mailingListen() {
  let recog = new SpeechRecognition();
  recog.start();
  recog.onstart = console.log('Started Listening .. ');

  recog.onresult = function (data) {
    return data;
  };
}

// Speak Text Entered
function Speak(TEXT) {
  const utter = new SpeechSynthesisUtterance();
  utter.volume = 1;
  utter.text = TEXT;
  window.speechSynthesis.speak(utter);
}

// Handle Results
function handleResults(data) {
  let text = data.results[0][0].transcript;
  text = text.toLowerCase();
  console.log(text);

  ProcessCommand(text);
}
function ProcessCommand(UserText) {
  if (UserText.includes('mail') || UserText.includes('Email')) {
    mailContent();

  } else if (UserText.includes('meeting') || UserText.includes('meet')) {
    Speak('Arranging a google meet');
    recordContent(4);
    setTimeout(() => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/meeting', true);
      xhr.send({ message: 'we are arranging a meet' });
    }, 3000);

  } else if (UserText.includes('instagram')) {
    Speak('Opening Instagram...');
    window.open('https://www.instagram.com/');
  } else if (UserText.includes('whatsapp')) {
    Speak('Opening whatsApp..');
    window.open('https://web.whatsapp.com/');
  } else if (UserText.includes('google')) {
    Speak('Opening Google');
    window.open('https://www.google.com/');
  } else if (UserText.includes('the') && UserText.includes('time')) {
    console.log('The time is :' + getCurrentTime());
  } else if (UserText.includes('mail') || UserText.includes('mail')) {
    Speak('Please...Tell the sender Mail Id');
  } else {
    console.log('I cant perform task : $(text)');
  }
}

// Current Time Function
function getCurrentTime() {
  const date = new Date();

  let hour = date.getHours();
  let minutes = date.getMinutes();
  let currentTimeIs = `${hour} ${minutes}`;
  Speak('The Time Is... ' + currentTimeIs);
}

// Intro Lines of Start Button
function intro() {
  var speech = new SpeechSynthesisUtterance();
  speech.text = 'Hello My name is Jarvis ! How May I Help you';
  window.speechSynthesis.speak(speech);
}

// recording the content
let meetingData = {};
let finalData = {};
function recordContent(value) {
  var text;
  let recognition = new SpeechRecognition();
  recognition.start();
  recognition.onstart = function () {
    console.log('You can speak now!!!');
  };

  recognition.onspeechend = function () {
    // when user is done speaking
    recognition.stop();
  };

  var content;
  recognition.onresult = function (event) {
    text = event.results[0][0].transcript;
    content = text;
    // document.getElementById('result').innerHTML = text;
    console.log(content);
    if (value == 1) {
      finalData['senderEmailId'] = text;
    } else if (value == 2) {
      // text = text.charAt(0).toUpperCase() + text.slice(1);
      finalData['mailSubject'] = text;
    } else if (value == 3) {
      finalData['mailText'] = text;
    } else if (value == 4) {
      meetingData['meetingType'] = text;
    }
  };
}

function mailContent() {
  Speak('Tell the sender Mail Id');
  recordContent(1);

  setTimeout(function () {
    Speak('Tell me the Mail Subject');
    recordContent(2);
  }, 14000);

  setTimeout(function () {
    Speak('Tell me the Mail Content');
    recordContent(3);
  }, 24000);

  setTimeout(() => {
    Speak('Ok ! Wait for few seconds send the mail..');
    console.log(finalData);
    localStorage.setItem('data', JSON.stringify(finalData));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/sendmail', true);
    xhr.send(JSON.stringify(finalData));

  }, 45000);
}

function editcontent() {
  let text = finalData['senderEmailId'];
  let Id;
  text = text.split(' ').join('').toLowerCase();
  if (text.includes('attherate')) {
    text = text.replace('attherate', '@');
  }
  let gif = text.split('@');
  if (gif[1].includes('gmail')) {
    Id = gif[0] + '@gmail.com';
  } else {
    Id = gif[0] + '@yahoo.com';
  }
  finalData['senderEmailId'] = Id;

  text = finalData['mailSubject'];
  text = text.charAt(0).toUpperCase() + text.slice(1);
  finalData['mailSubject'] = text;
}
