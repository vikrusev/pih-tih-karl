import express from 'express';
import passport from 'passport';
import * as jwt from 'jsonwebtoken';

import UserModel from '../schemas/user'

const apiRouter = express.Router();

apiRouter.get('/users', (req, res) => {
    UserModel.find((err, users) => {
        res.send({ users });
    });
})

apiRouter.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.status(400).send({ error: 'not enough information added' });
    }

    UserModel.create({ email, username, password }, (err, newUser) => {
        if (err) {
            // res.send('something went wrong'); //TODO: use error codes
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ message: 'Success!' });
        }
    });
});

apiRouter.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) { return next(err); }

        if (!user) { res.send({ error: "username or password is wrong" }); } //TODO: better errors

        req.login(user, { session: false }, async (err) => {
            if (err) { return next(err); }

            const body = { _id: user._id, username: user.username };

            const token = jwt.sign({ user: body }, 'top_secret', { expiresIn: '12h' });
            const userData = {
                email: user.email,
                username: user.username,
                id: user._id
            };


            res.status(200).send({
                token,
                user: userData
            });
        });
    })(req, res, next);
})

apiRouter.get('/secure', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            res.status(400).send({ error: `Error occured ${err.message}` });
        } else if (info !== undefined) {
            res.status(400).send({ error: info.message });
        } else {
            res.status(200).send({ message: 'success' });
        }
    })(req, res, next);
})

export { apiRouter };