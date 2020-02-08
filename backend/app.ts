// server-related modules
import express from 'express'
import { createServer, Server } from 'http'

const io = require('socket.io')

// additional modules
import path from 'path'

// helpers
import config from './config'
import { appLog } from './modules/helpers/logHelper'

// constants
import * as constants from './globals/constants'

// routes
import { sampleRouter } from './routes/sample'

export default class App {

    private expressApp: express.Application = express();
    private server: Server = createServer(this.expressApp);
    private socketIO = io(this.server);

    private config: Config = config;

    constructor() { }

    start(): void {
        this.setProcessEvents();
        this.useMiddlewares();
        this.useRoutes();
        this.setupSocketIO();

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
        this.expressApp
            .use(express.json())
            .use(express.urlencoded({ extended: false }))
            .use(express.static(path.join(this.config.app_root)));
    }

    private useRoutes(): void {
        this.expressApp.use('/sample', sampleRouter)

        this.expressApp.all('*', (req, res) => {
            res.sendFile(path.join(this.config.app_root, 'angular-root.html'));
        })

        // TO-DO: make a better error handler
        this.expressApp.use((err, req, res, next) => {
            if (err.message === 'Unauthorized') {
                res.status(401).send('Unauthorized');
                return;
            }

            res.status(500).send('Server error!');
        })
    }

    private setupSocketIO(): void {
        this.socketIO.on('connection', function (client) {
            console.log('Client connected...');

            client.on('join', function (data) {
                console.log(data);
                client.emit('messages', 'Hello from server');
            });

        });
    }

    private startServer(): void {
        const port = process.env.PORT || this.config.port;
        this.server.listen(port, () => {
            // a console.log is mandatory so to open the browser at the given port when the server has started running
            console.log(`Server listening on port: ${port}`);
        });
    }

}

(new App()).start();