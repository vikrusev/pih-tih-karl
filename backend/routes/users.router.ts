import express from 'express';
import SocketService  from '../modules/helpers/socketService'

const usersRouter = express.Router();

usersRouter.get('/online', async (req, res) => {
    try {
        const users: IBasicUser[] = null;
    
        res.json({ users: result });
    } catch (error) {

    }
})

export { usersRouter };