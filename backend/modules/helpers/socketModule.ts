const io = require('socket.io');

import { appLog } from './logHelper'
import UserModel from '../../schemas/user';

const socketModule = (() => {

    let socketIO = null;

    const socketIOInit = (server): void => {
        socketIO = io(server);
    }

    const socketIOStart = (): void => {
        awaitEvents();
    }

    const getAllActiveSockets = (): any[] => {
        return socketIO.sockets.sockets;
    }

    const getAllActiveUsers = async (): Promise<IBasicUser[]> => {
        const allActiveSockets = getAllActiveSockets();

        let users: IBasicUser[] = [];
        for (const socket in allActiveSockets) {
            const username = allActiveSockets[socket].request._query['username'];
         
            const user = await UserModel.findOne({ username: username }).lean();
            users.push(user);
        }

        return users;
    }

    const awaitEvents = (): void => {
        socketIO.on('connection', (client) => {
            appLog('info', 'A user has connected')

            awaitClientEvents(client);
        });
    }

    const awaitClientEvents = (client): void => {
        client.on('logout-disconnect', () => {
            appLog('info', 'A user has disconnected');
            client.disconnect();
        });
    }

    return {
        socketIO,
        socketIOInit,
        socketIOStart,
        getAllActiveUsers,
        getAllActiveSockets
    }
})()

export { socketModule };