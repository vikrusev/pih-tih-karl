const io = require('socket.io');

import { appLog } from './logHelper'

const socketModule = (() => {

    let socketIO = null;

    const socketIOInit = (server): void => {
        socketIO = io(server);
    }

    const socketIOStart = (): void => {
        awaitEvents();
    }

    const getAllOnlineUsers = (): IBasicUser[] => {
        return socketIO.sockets.sockets;
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
        getAllOnlineUsers
    }
})()

export { socketModule };