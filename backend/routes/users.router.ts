import express from 'express';
import { socketModule } from '../modules/socketModule'
import { responseModule } from '../modules/responseModule'

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

export { usersRouter };