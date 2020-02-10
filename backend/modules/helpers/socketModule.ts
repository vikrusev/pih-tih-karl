const io = require('socket.io');

import { appLog } from './logHelper'
import UserModel from '../../schemas/user';

const socketModule = (() => {

    let socketIO = null;

    const socketIOInit = (server): void => {
        socketIO = io(server, { pingTimeout: 200000 });
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

        client.on('connect_timeout', (timeout) => {
            console.log(timeout)
        });

        client.on('error', (error) => {
            console.log(error)
        });

        client.on('reconnect', (attemptNumber) => {
            console.log(attemptNumber)
        });

        client.on('reconnect_attempt', (attemptNumber) => {
            console.log(attemptNumber)
        });

        client.on('reconnecting', (attemptNumber) => {
            console.log(attemptNumber)
        });

        client.on('reconnect_error', (error) => {
            console.log(error)
        });

        client.on('reconnect_failed', () => {
            console.log('sdfsdf')
        });

        client.on('ping', () => {
            console.log('fsdfisdnf')
        });

        client.on('pong', (latency) => {
            console.log(latency)
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