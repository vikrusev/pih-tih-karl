import express from 'express';
import cors from 'cors';
import path from 'path';
import config from './config'
import { appLog } from './modules/helpers/logHelper'

import passport from 'passport'
import { Strategy as localStrategy } from 'passport-local'
import { ExtractJwt, Strategy as JWTstrategy } from 'passport-jwt'

import * as jwt from 'jsonwebtoken'

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

        passport.use('login', new localStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ username });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (err) {
                done(err);
            }
        }));

        passport.use('jwt', new JWTstrategy({
            secretOrKey: 'top_secret', // TODO: change this
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }, async (jwt_payload, done) => {
            try {
                const user = await UserModel.findById(jwt_payload._id);
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                done(error);
            }
        }));
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

            if (!username || !password || !email) {
                res.send('not enough information added');
            }

            UserModel.create({ email, username, password }, (err, newUser) => {
                if (err) {
                    // res.send('something went wrong'); //TODO: use error codes
                    res.send(err.message);
                } else {
                    res.send('Success!');
                }
            });
        });

        this.app.post('/api/login', (req, res, next) => {
            passport.authenticate('login', (err, user, info) => {
                if (err) { return next(err); }

                if (!user) { res.send("username or password is wrong"); } //TODO: better errors

                req.login(user, { session: false }, async (err) => {
                    if (err) { return next(err); }

                    const body = { _id: user._id, username: user.username };

                    const token = jwt.sign({ user: body }, 'top_secret');

                    res.status(200).send(token);
                });
            })(req, res, next);
        })

        this.app.get('/api/secure', (req, res, next) => {
            passport.authenticate('jwt', { session: false }, (err, user, info) => {
                if (err) {
                    console.log(err);
                } else if (info !== undefined) {
                    res.send(info.message);
                } else {
                    res.send('success');
                }
            })(req, res, next);
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