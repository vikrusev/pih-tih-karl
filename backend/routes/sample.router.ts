const express = require("express");
const sampleRouter = express.Router();

sampleRouter.get('/test-proxy', (req, res) => {
    res.send('passed the proxy!');
})

sampleRouter.get('/', (req, res) => {
    res.send('yep, using sample route!');
})

export { sampleRouter };