const mongoose = require('mongoose');

const mongoURL = 'mongodb+srv://viktorvr:k6GIGcraDxiPgAZs@pihtihkarl-3grbo.azure.mongodb.net/test?retryWrites=true&w=majority';
const mongodb = mongoose.connect(mongoURL, {
        server: {
            auto_reconnect: true,
            poolSize: 5,
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            },
            reconnectInterval: 20000,
            reconnectTries: 100
        }
    }, (err) => { console.log("DB OK", err); });

module.exports = { mongoose };
