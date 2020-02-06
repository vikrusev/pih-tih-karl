import mongoose from 'mongoose';

export default class ConfigModuleProd {

    mongodb = null;
    mongoURL: string = 'mongodb+srv://viktorvr:1t5HqATyTC7XZ0mc@pihtihkarl-3grbo.azure.mongodb.net/pihtihkarl?retryWrites=true&w=majority';
    mongoose = mongoose;
    port: number | string = 3000;

    constructor() {
        this.mongodb = this.mongoose.connect(this.mongoURL, {
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

        this.setConnectionEvents();
    }

    // TO-DO: log errors to a .log file
    private setConnectionEvents(): void {
        this.mongoose.connection.on('error', e => {
            console.error("error", `db: mongodb error ${e}`);
        });
        this.mongoose.connection.on('connected', () => {
            console.error("info", 'db: mongodb is connected: ' + this.mongoURL);
        });
        this.mongoose.connection.on('reconnected', () => {
            console.error("info", 'db: mongodb is reconnected: ' + this.mongoURL);
        });
    
        this.mongoose.connection.on('disconnecting', () => {
            console.error("error", 'db: mongodb is disconnecting!!!');
        });
    
        this.mongoose.connection.on('disconnected', () => {
            console.error("error", 'db: mongodb is disconnected!!!');
        });
    
        this.mongoose.connection.on('timeout', e => {
            console.error("error", "db: mongodb timeout " + e);
            this.mongoose.connect(this.mongoURL, {
                server: {
                    auto_reconnect: true
                }
            });
        });
    
        this.mongoose.connection.on('close', () => {
            console.error("error", 'db: mongodb connection closed');
            this.mongoose.connect(this.mongoURL, {
                server: {
                    auto_reconnect: true
                }
            });
        });
    }

}