import { Strategy as localStrategy } from 'passport-local'
import { ExtractJwt, Strategy as JWTstrategy } from 'passport-jwt'

import UserModel from '../schemas/user'

export const localPassportStrategy = new localStrategy({
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
})

export const JWTPassportStrategy = new JWTstrategy({
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
})