import express from 'express';
import path from 'path';
import config from './config'
import { appLog } from './modules/helpers/logHelper'

// constants
import * as constants from './globals/constants'

// routes
import { sampleRouter } from './routes/sample'

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

    private useRoutes(): void {
        this.app.use('/sample', sampleRouter)

        this.app.all('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'angular-root.html'));
        })

        // TO-DO: make a better error handler
        this.app.use((err, req, res, next) => {
            if (err.message === 'Unauthorized') {
                res.status(401).send('Unauthorized');
                return;
            }

            res.status(500).send('Server error!');
        })
    }

    private startServer(): void {
        const port = process.env.PORT || this.config.port;
        this.app.listen(port, () => {
            // a console.log is mandatory so to open the browser at the given port when the server has started running
            console.log(`Server listening on port: ${port}`);
        });
    }

}

(new App()).start();