import express from 'express';
import path from 'path';
import config from './config'

import UserModel from './schemas/user'

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

        // TO-DO: remove UserModel from this file
        const mockUser: IBasicUser = {
            username: 'vikrusev1',
            password: 'Test123!',
            firstName: "Viktor",
            lastName: "Rusev",
            profile: null,
            lastLogin: null
        }

        UserModel.create(mockUser, function (err, user: IUserDocumentModel) {
            console.log(user);
            console.log(user.fullName());
        });

        this.startServer();
    }

    private setProcessEvents(): void {
        process.on('uncaughtException', err => {
            console.error('error', `Caught unhandled exception: ${err.message} > Stack: ${err.stack}`);
        })
        .on('unhandledRejection', (reason: Error, p) => {
            console.error('error', `Unhandled Rejection at: Promise ${p}. Reason: ${reason.message} > Stack(full): ${reason.stack}.`);
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
            console.log(`Server listening on port: ${port}`);
        });
    }

}

(new App()).start();