import mongoose from 'mongoose'
import moment from 'moment';
import path from 'path'
import { createLogger, format, transports } from 'winston'

import { appLog } from '../modules/helpers/logHelper'

const { combine, timestamp, printf } = format;

export default class ConfigModuleProd {

    logger = null;
    readonly mongoDB = 'pihtihkarl';
    readonly mongoURL: string = `mongodb+srv://viktorvr:1t5HqATyTC7XZ0mc@pihtihkarl-3grbo.azure.mongodb.net/${this.mongoDB}?retryWrites=true&w=majority`;
    readonly mongoose = mongoose;
    readonly port: number | string = 3000;
    readonly app_root: string = path.join(path.resolve(__dirname), '..');
    readonly appLogFile: string = path.join(this.app_root, 'logs', 'app.log');
    readonly appLogDateFormat: string = "YYYY-MM-DD HH:mm:ss";

    constructor() {
        this.establishConnection();
        this.setConnectionEvents();

        this.createLogger();
    }

    private establishConnection(): void {
        this.mongoose.connect(this.mongoURL, {
            server: {
                auto_reconnect: true,
                poolSize: 5,
                socketOptions: {
                    keepAlive: 1,
                    connectTimeoutMS: 30000
                },
                reconnectInterval: 15000,
                reconnectTries: 100
            }
        })
    }

    private setConnectionEvents(): void {
        this.mongoose.connection.on('error', e => {
            appLog('error', `db: mongodb error ${e}`);
        });
        this.mongoose.connection.on('connected', () => {
            appLog('info', `db: mongodb is connected to db: ${this.mongoDB}`);
        });
        this.mongoose.connection.on('reconnected', () => {
            appLog('info', `db: mongodb is reconnected to db: ${this.mongoURL}`);
        });

        this.mongoose.connection.on('disconnecting', () => {
            appLog('error', 'db: mongodb is disconnecting!!!');
        });

        this.mongoose.connection.on('disconnected', () => {
            appLog('error', 'db: mongodb has disconnected!!!');
        });

        this.mongoose.connection.on('close', () => {
            appLog('info', 'db: mongodb connection closed');
        });

        this.mongoose.connection.on('timeout', e => {
            appLog('error', `db: mongodb timeout ${e}. Trying to reconnect...`);
            this.mongoose.connect(this.mongoURL, {
                server: {
                    auto_reconnect: true,
                    poolSize: 5,
                    socketOptions: {
                        keepAlive: 1,
                        connectTimeoutMS: 30000
                    },
                    reconnectInterval: 15000,
                    reconnectTries: 100
                }
            });
        });
    }

    private createLogger(): void {
        this.logger = createLogger({
            format: combine(
                timestamp({
                    format: moment().format(this.appLogDateFormat)
                }),
                printf(options => `${options.timestamp} ${options.level.toUpperCase()} ${(options.message ? options.message : '')}`)
            ),
            transports: [
                new transports.File({
                    filename: this.appLogFile
                }),
            ]
        });
    }

}