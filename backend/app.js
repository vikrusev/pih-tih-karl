var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/test-proxy', (req, res) => {
  res.send('passed the proxy!');
})

app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'angular-root.html'));
})

app.listen(process.env.PORT, function() {
  console.log(`Server listening on port: ${process.env.PORT}`);
});