import express from 'express';
import path from 'path';
import config from './config'

import UserModel from './schemas/user'

// TO-DO: create error handlers 
export default class App {

    private config: Config = null;
    private app: express.Application = null;

    constructor() {
        this.app = express();
        this.config = config;
    }

    start(): void {
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

    private useMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(express.static(path.join(__dirname)));
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