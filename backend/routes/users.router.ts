import express from 'express';
import moment from 'moment';

import { socketModule } from '../modules/socketModule'
import { responseModule } from '../modules/responseModule'
import UserModel from '../schemas/user';

const usersRouter = express.Router();

usersRouter.get('/online', async (req, res) => {
    try {
        const users: IExtendedUser[] = await socketModule.getAllActiveUsers();

        responseModule.ok(res, users);
    }
    catch (err) {
        responseModule.err(res, err);
    }
})

usersRouter.patch('/update-profile', async (req, res) => {
    try {
        const { username, profile } = req.body;
        
        const birthDate: Date = new Date(profile.birthDate);
        profile.birthDate = moment(birthDate).format('YYYY-MM-DD');

        const newUser = await UserModel.findOneAndUpdate({ username: username }, { $set: { profile: profile } }, { new: true }).lean();

        responseModule.ok(res, newUser);
    }
    catch (err) {
        responseModule.err(res, err);
    }
})

export { usersRouter };