// imports
const puppy = require('puppeteer');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

// Static Files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');

app.use('', (req, res) => {
  res.render('index');
});

// Listen on port 3000
app.listen(port, () => console.log(`listening on port ${port}`));
