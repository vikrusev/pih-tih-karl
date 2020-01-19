var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res) => {
  console.log(process.env);
  res.sendFile(path.join(__dirname, 'public', 'angular-root.html'));
})

app.listen(process.env.PORT, function() {
  console.log(`Server listening on port: ${process.env.PORT}`);
});