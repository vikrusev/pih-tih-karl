import express from 'express';
import { socketModule } from '../modules/helpers/socketModule'
import { responseModule } from '../modules/helpers/responseModule'

const usersRouter = express.Router();

usersRouter.get('/online', async (req, res) => {
    try {
        const users: IBasicUser[] = await socketModule.getAllActiveUsers();

        responseModule.ok(res, users);
    }
    catch (err) {
        responseModule.err(res, err);
    }
})

export { usersRouter };