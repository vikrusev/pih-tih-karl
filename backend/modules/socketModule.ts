const io = require('socket.io');

import { appLog } from './helpers/logHelper'
import UserModel from '../schemas/user';

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

    const getAllActiveUsers = async (): Promise<IExtendedUser[]> => {
        const allActiveSockets = getAllActiveSockets();
        let usernames: string[] = [];

        let users: IExtendedUser[] = [];
        let username: string = null;
        const projection = {
            username: 1,
            email: 1,
            wins: 1,
            losses: 1
        }
        for (const socket in allActiveSockets) {
            username = allActiveSockets[socket].request._query['username'];

            if (!usernames.includes(username)) {
                const user = await UserModel.findOne({ username: username }, projection).lean();
    
                users.push(user);
                usernames.push(username);
            }
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