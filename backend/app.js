const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: false }))
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