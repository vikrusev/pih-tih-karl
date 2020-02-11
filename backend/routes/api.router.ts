import express from 'express';
import passport from 'passport';
import * as jwt from 'jsonwebtoken';

import UserModel from '../schemas/user'

import { responseModule } from '../modules/responseModule'

const apiRouter = express.Router();

apiRouter.get('/users', (req, res) => {
    UserModel.find((err, users) => {
        responseModule.ok(res, users);
    });
})

apiRouter.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        responseModule.err(res, 'not enough information added', 400);
    }

    UserModel.create({ email, username, password }, (err, newUser) => {
        if (err) {
            // res.send('something went wrong'); //TODO: use error codes
            responseModule.err(res, err, 400);
        } else {
            responseModule.ok(res, 'Success!');
        }
    });
});

apiRouter.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) { return next(err); }

        //TODO: better errors
        if (!user) {
            responseModule.unauthorized(res, 'username or password is wrong');
        }

        req.login(user, { session: false }, async (err) => {
            if (err) { return next(err); }

            const body = { _id: user._id, username: user.username };

            const token = jwt.sign({ user: body }, 'top_secret', { expiresIn: '12h' });
            const userData = {
                email: user.email,
                username: user.username,
                id: user._id
            };

            responseModule.ok(res, {
                token,
                user: userData
            });
        });
    })(req, res, next);
})

apiRouter.get('/secure', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            responseModule.err(res, `Error occured: ${err.message}`, 400);
        } else if (info !== undefined) {
            responseModule.err(res, info.message, 400);
        } else {
            responseModule.ok(res, 'success');
        }
    })(req, res, next);
})

export { apiRouter };