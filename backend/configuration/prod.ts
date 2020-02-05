import * as mongoose from 'mongoose'

const mongoURLProd = 'mongodb+srv://viktorvr:1t5HqATyTC7XZ0mc@pihtihkarl-3grbo.azure.mongodb.net/test?retryWrites=true&w=majority';

class ConfigModuleProd {

    mongodb = null;
    mongoURLDev = 'mongodb+srv://viktorvr:1t5HqATyTC7XZ0mc@pihtihkarl-3grbo.azure.mongodb.net/test?retryWrites=true&w=majority';
    mongoose = mongoose;

    constructor() {
        this.mongodb = () => this.mongoose.connect(this.mongoURLDev, {
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
    }

}

module.exports = ConfigModuleProd;