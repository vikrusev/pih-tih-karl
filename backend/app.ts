// server-related modules
import express from 'express';
import cors from 'cors';
import { createServer, Server } from 'http';

// additional modules
import path from 'path';

// helpers
import config from './config';
import { appLog } from './modules/helpers/logHelper';
import { responseModule } from './modules/responseModule';
import { socketModule } from './modules/socketModule';

// passport imports
import passport from 'passport';
import { localPassportStrategy, JWTPassportStrategy } from './strategies/passport.startegies';

// constants
import * as constants from './globals/constants';

// routes
import { apiRouter } from './routes/api.router';
import { usersRouter } from './routes/users.router';
import { mainRouter } from './routes/main.router';

export default class App {

    private expressApp: express.Application = express();
    private server: Server = createServer(this.expressApp);

    constructor() { }

    start(): void {
        this.setProcessEvents();
        this.useMiddlewares();
        this.useRoutes();
        this.setPassportStrategies();
        this.setupSocketIOServer();

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
            .use(cors())
            .use(express.json())
            .use(express.urlencoded({ extended: false }))
            .use(express.static(path.join(config.app_root)))
            .use('/static_files', express.static(path.join(config.app_root, '..', 'static_files')));
    }

    private setPassportStrategies(): void {
        passport.use('login', localPassportStrategy);
        passport.use('jwt', JWTPassportStrategy);
    }
    
    private useRoutes(): void {
        this.expressApp.use('/api', apiRouter);
        this.expressApp.use('/users', usersRouter);
        this.expressApp.use('/', mainRouter);

        // TO-DO: make a better error handler
        this.expressApp.use((err, req, res, next) => {
            if (err.message === 'Unauthorized') {
                responseModule.unauthorized(res, err);
                return;
            }

            responseModule.err(res, err);
        })
    }

    private setupSocketIOServer(): void {
        socketModule.socketIOInit(this.server);
        socketModule.socketIOStart();
    }

    private startServer(): void {
        const port = process.env.PORT || config.port;
        this.server.listen(port, () => {
            // a console.log is mandatory so to open the browser at the given port when the server has started running
            console.log(`Server listening on port: ${port}`);
        });
    }

}

(new App()).start();