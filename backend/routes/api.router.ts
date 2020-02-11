import express from 'express';
import passport from 'passport';
import * as jwt from 'jsonwebtoken';

import UserModel from '../schemas/user'

import { responseModule } from '../modules/responseModule'

import { registerRouter } from './register.router'

const apiRouter = express.Router();

apiRouter.use('/register', registerRouter);

apiRouter.get('/users', (req, res) => {
    UserModel.find((err, users) => {
        responseModule.ok(res, users);
    });
})

apiRouter.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) { return next(err); }

        //TODO: better errors
        if (!user) {
            responseModule.unauthorized(res, 'username or password is wrong');
        }

        req.login(user, { session: false }, async (err) => {
            if (err) { return next(err); }

            const token = jwt.sign({ user: user }, 'top_secret', { expiresIn: '12h' });

            const userData = {
                ...user.toObject(),
                password: undefined
            }

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