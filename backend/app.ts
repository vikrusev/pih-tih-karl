import express from 'express';
import path from 'path';
import config from './config'
import { appLog } from './modules/helpers/logHelper'

import * as constants from './globals/constants'

export default class App {

    private config: Config = null;
    private app: express.Application = null;

    constructor() {
        this.app = express();
        this.config = config;
    }

    start(): void {
        this.setProcessEvents();
        this.useMiddlewares();
        this.useRoutes();

        this.startServer();
    }

    private setProcessEvents(): void {
        process.on('uncaughtException', err => {
            appLog('error', `${constants.unhandledException}: ${err.message} > Stack: ${err.stack}`);
        })
        .on('unhandledRejection', (reason: Error, p) => {
            appLog('error', `${constants.unhandledRejection}: Promise ${p}. Reason: ${reason.message} > Stack(full): ${reason.stack}.`);
        });
    }

    private useMiddlewares(): void {
        this.app
            .use(express.json())
            .use(express.urlencoded({ extended: false }))
            .use(express.static(path.join(__dirname)));
    }

    // TO-DO: move routes to .route files
    private useRoutes(): void {
        this.app.get('/test-proxy', (req, res) => {
            res.send('passed the proxy!');
        })
        
        this.app.all('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'angular-root.html'));
        })
    }

    private startServer(): void {
        const port = process.env.PORT || this.config.port;
        this.app.listen(port, () => {
            appLog('info', `Server listening on port: ${port}`);
        });
    }

}

(new App()).start();