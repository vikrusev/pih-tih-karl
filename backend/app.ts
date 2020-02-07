import express from 'express';
import cors from 'cors';
import path from 'path';
import config from './config'
import { appLog } from './modules/helpers/logHelper'

import UserModel from './schemas/user'

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
            .use(cors())
            .use(express.json())
            .use(express.urlencoded({ extended: false }))
            .use(express.static(path.join(__dirname)));
    }

    private useRoutes(): void {
        this.app.get('/test-proxy', (req, res) => {
            res.send('passed the proxy!');
        })

        this.app.get('/api/users', (req, res) => {
            UserModel.find((err, users) => {
                res.send(users);
            });
        })

        this.app.post('/api/register', (req, res) => {
            const username = req.body.username;
            const password = req.body.password;
            const email = req.body.email;
            res.send(`${username} ${password} ${email}`);
        })

        this.app.post('/api/login', (req, res) => {
            const username = req.body.username;
            const password = req.body.password;
            UserModel.findOne({ username, password }).exec((err, user) => {
                if (user) {
                    // res.send({ username, password });
                    res.send({ m: "it exists!" });
                } else {
                    res.send({ m: "habibi" });
                }
            })

        })

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