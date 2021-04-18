// const puppy = require('puppeteer');
// const fs = require('fs')
const btn = document.getElementById('btn');
// const mailing = require('./mail');

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

// FinalData for Mail Json file containing senderEmailId, mailSubject, mailContent
let finalData = {};

// Meeting data
let meetingData = {};

// Data
let searchData = {};

// Start Listening
// Open mic of the system and listen to the first command
function startListening() {
  let recog = new SpeechRecognition();
  recog.start();
  recog.onstart = console.log('Started Listening .. ');

  recog.onresult = function (data) {
    handleResults(data);
  };
}

// Listen to different content of Mail and meeting
function Listen() {
  const ListeningPromise = new Promise((resolve, rejects) => {
    let recog = new SpeechRecognition();
    recog.start();
    recog.onstart = console.log('Started Listening');

    recog.onspeechend = function () {
      recog.stop();
    };

    recog.onresult = function (data) {
      resolve(data);
    };
  });

  return ListeningPromise;
}

// ----------------------------------------------------------------

// Speak Text Entered
function Speak(TEXT) {
  const utter = new SpeechSynthesisUtterance();
  utter.volume = 1;
  utter.text = TEXT;
  window.speechSynthesis.speak(utter);
}

// -------------------------------------------------------------------

// Handle Results/Data
function handleResults(data) {
  let text = data.results[0][0].transcript;
  text = text.toLowerCase();
  console.log(text);

  ProcessCommand(text);
}

// Processes the User Command and work accordingly
function ProcessCommand(UserText) {
  if (UserText.includes('mail') || UserText.includes('Email')) {
    mailContent();
  } else if (UserText.includes('meeting') || UserText.includes('meet')) {
    Speak('Arranging a google meet');
    meetingContent(UserText);
  } else if (UserText.includes('instagram') && UserText.includes('open')) {
    Speak('Opening Instagram...');
    window.open('https://www.instagram.com/');
  } else if (UserText.includes('whatsapp') && UserText.includes('open')) {
    Speak('Opening whatsApp..');
    window.open('https://web.whatsapp.com/');
  } else if (UserText.includes('google') && UserText.includes('open')) {
    Speak('Opening Google');
    window.open('https://www.google.com/');
  } else if (UserText.includes('google') && UserText.includes('search')) {
    Speak('Doing a google search for you');
    googleSearch();
  } else if (UserText.includes('youtube') && UserText.includes('open')) {
    Speak('Opening youtube');
  } else if (UserText.includes('youtube') && UserText.includes('search')) {
    Speak('Doing a youtube search for you');
    youtubeSearch();
  } else if (UserText.includes('the') && UserText.includes('time')) {
    console.log('The time is :' + getCurrentTime());
  } else {
    console.log('I cant perform task : $(text)');
    Speak('I cant perform task');
  }
}

// -------------------------------------------------------------------

// Current Time Function
function getCurrentTime() {
  const date = new Date();

  let hour = date.getHours();
  let minutes = date.getMinutes();
  let currentTimeIs = `${hour} ${minutes}`;
  Speak('The Time Is... ' + currentTimeIs);

  return currentTimeIs;
}

// Intro Lines of Start Button
function intro() {
  var speech = new SpeechSynthesisUtterance();
  speech.text = 'Hello My name is Jarvis ! How May I Help you';
  window.speechSynthesis.speak(speech);
}

// -------------------------------------------------------------------

// Mail Content
// Ask of EmailID, Subject and Content of mail
function mailContent() {
  Speak('Tell the sender Mail Id');
  Listen()
    .then((data) => {
      let text = data.results[0][0].transcript;
      text = text.split(' ').join('').toLowerCase();
      if (text.includes('attherate')) {
        text = text.replace('attherate', '@');
      }
      finalData['senderEmailId'] = text;
    })
    .then(() => {
      Speak('Tell me the Mail Subject');
    })
    .then(() => {
      Listen()
        .then((data) => {
          let text = data.results[0][0].transcript;
          text = text.charAt(0).toUpperCase() + text.slice(1);
          console.log(text);
          finalData['mailSubject'] = text;
        })
        .then(() => {
          Speak('Tell me the Mail Content');
        })
        .then(() => {
          Listen()
            .then((data) => {
              let text = data.results[0][0].transcript;
              text = text.charAt(0).toUpperCase() + text.slice(1);
              console.log(text + '.');
              finalData['mailText'] = text + '.';
            })
            .then(() => {
              Speak('Ok ! Wait for few seconds send the mail..');
              console.log(finalData);
            })
            .then(() => {
              axios({
                url: '/sendMail',
                method: 'POST',
                data: finalData,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

// -------------------------------------------------------------------

// Arranging Different Meeting
function meetingContent(data) {
  if (data.includes('schedule')) {
    Speak("What's the Date for the meeting..");
    Listen()
      .then((listen) => {
        let text = listen.results[0][0].transcript;
        text = text.toLowerCase();
        console.log(text);

        meetingData['meetingType'] = 'schedule';
        meetingData['meetingDate'] = text;
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 3000);
        });
      })
      .then(() => {
        Speak('What are the timings...');
        Listen()
          .then((voice) => {
            let text = voice.results[0][0].transcript;
            text = text.toLowerCase();
            text = text.split('to');
            let numb = text[0].match(/\d/g);
            numb = numb.join('');
            meetingData['meetingStartTime'] = numb;

            numb = text[1].match(/\d/g);
            numb = numb.join('');
            meetingData['meetingStartTime'] = numb;
          })
          .then(() => {
            Speak('Please Tell the meeting Guest Email one by one..');
            meetingData['GuestList'] = [];
          })
          .then(() => {
            let i = 0;
            do {
              Listen()
                .then((value) => {
                  let text = value.results[0][0].transcript;
                  text = text.split(' ').join('').toLowerCase();
                  if (text.includes('attherate')) {
                    text = text.replace('attherate', '@');
                  }
                  meetingData['GuestList'].push(text);
                })
                .then(() => {
                  Speak('Ok next..');
                  i = i + 1;
                })
                .catch((err) => {
                  console.log(err);
                });
            } while (i < 5);
          })
          .then(() => {
            Speak('Ok.. Scheduling a meet');
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    meetingData['meetingType'] = 'instant';
    axios({
      url: '/meeting',
      method: 'POST',
      data: meetingData,
    });
  }
}

// Google Search
async function timeout(time) {
  return new Promise(function (resolve, reject) {
    // Asynchronous setTimeout function
    setTimeout(() => {
      resolve();
    }, time);
  });
}

async function googleSearch() {
  await timeout(3000);
  Speak('Please tell what do you want to google..');
  Listen()
    .then((data) => {
      let text = data.results[0][0].transcript;
      text = text.charAt(0).toUpperCase() + text.slice(1);
      console.log(text);

      return text;
    })
    .then((val) => {
      searchData['text'] = val;
      console.log(searchData);
    })
    .then(() => {
      axios({
        url: '/googleSearch',
        method: 'POST',
        data: searchData,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

async function youtubeSearch() {
  await timeout(3000);
  Speak('Please tell how do to want to youtube..');
  Listen()
    .then((data) => {
      let text = data.results[0][0].transcript;
      text = text.charAt(0).toUpperCase() + text.slice(1);
      console.log(text);

      return text;
    })
    .then((val) => {
      searchData['text'] = val;
      console.log(searchData);
    })
    .then(() => {
      axios({
        url: '/youtubeSearch',
        method: 'POST',
        data: searchData,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
// ---------------------------------------------------------------
