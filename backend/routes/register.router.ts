import express, { response } from 'express';
import UserModel from '../schemas/user'

import { responseModule } from '../modules/responseModule'

const registerRouter = express.Router();

registerRouter.post('/', (req, res) => {
    const { username, password, confPassword, email } = req.body;

    if (!username || !password || !email) {
        responseModule.err(res, 'Not enough information added', 400);
    }

    if (password !== confPassword) {
        responseModule.err(res, 'Passwords missmatch', 400);
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

registerRouter.post('/availability', async (req, res) => {
    const fields = req.body;
    const takenFields = [];

    for (const f in fields) {
        const user = await UserModel.find({ [f]: fields[f] }, { [f]: 1 }).lean();

        if (user.length) {
            takenFields.push(f);
        }
    }

    responseModule.ok(res, takenFields);
})

export { registerRouter };