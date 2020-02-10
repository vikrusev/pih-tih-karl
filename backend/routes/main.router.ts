import express from 'express';
import path from 'path';
import config from '../config'

const mainRouter = express.Router();

mainRouter.all('*', (req, res) => {
    res.sendFile(path.join(config.app_root, 'angular-root.html'));
})

export { mainRouter };