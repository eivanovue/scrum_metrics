require('dotenv').config();
const express = require('express');
const pretty = require('express-prettify');
const https = require('https');
const fs = require('fs');

const trello = require('./rotues/trello');
const jira = require('./rotues/jira');

const app = express();

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/trello', trello);
app.use('/jira', jira);
app.use(pretty());

app.listen(process.env.PORT, () => console.log(`The API is listening on port ${process.env.PORT}`));

https
  .createServer(
    {
      key: fs.readFileSync('/etc/letsencrypt/live/eivanov.dev/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/eivanov.dev/cert.pem'),
      ca: fs.readFileSync('/etc/letsencrypt/live/eivanov.dev/fullchain.pem'),
    },
    app,
  )
  .listen(process.env.SSL_PORT, () => {
    console.log(`HTTPS Server is listening on port ${process.env.SSL_PORT}`);
  });
