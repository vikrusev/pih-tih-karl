const express = require('express');
const path = require('path');
const app = express();
const config = require('./config');
const mongoose = require('mongoose');


app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname)));

const UserModel = require('./schemas/user');

app.get('/test-proxy', (req, res) => {
  res.send('passed the proxy!');
})

app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'angular-root.html'));
})

app.listen(process.env.PORT, function() {
  console.log(`Server listening on port: ${process.env.PORT}`);
});

module.exports = app;