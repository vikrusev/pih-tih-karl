const io = require('socket.io');

import { appLog } from './helpers/logHelper'
import UserModel from '../schemas/user';

interface ActiveChallange {
    challangerID: string,
    opponentID: string
}

const socketModule = (() => {

    let socketIO = null;
    let activeChallanges: ActiveChallange[] = [];

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

    const getSocketByUsername = (username: String) => {
        const allActiveSockets = getAllActiveSockets();

        for (const socket in allActiveSockets) {
            const socketUsername: String = getSocketUsername(allActiveSockets[socket]);

            if (username === socketUsername) {
                return allActiveSockets[socket];
            }
        }

        return null;
    }

    const findActiveChallange = (id: String, challanger: Boolean = false): ActiveChallange => {
        for (const challange of activeChallanges) {
            // find by challanger socket ID
            if (challanger) {
                if (challange.challangerID === id) {
                    return challange;
                }
                else if (challange.opponentID === id) {
                    return challange
                }
            }
        }

        return null;
    }

    const getSocketUsername = (socket): String => {
        return socket.request._query['username'];
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

        client.on('challange-player', (username: String) => {
            const challangerUsername: String = getSocketUsername(client);
            const opponentSocket = getSocketByUsername(username);

            appLog('info', `${username} was challanged by ${challangerUsername}`);

            if (opponentSocket) {
                const data = {
                    username: challangerUsername,
                    message: `${challangerUsername} has challanged you!`
                }

                const newChallange: ActiveChallange = {
                    challangerID: client.id,
                    opponentID: opponentSocket.id
                }
                activeChallanges.push(newChallange)

                opponentSocket.emit('incoming-challange', data);
            }
            else {
                client.emit('user-not-found', `Opponent ${username} was not found!`);
            }
        })

        client.on('answer-challange', (choice: Boolean) => {
            const challangeData: ActiveChallange = findActiveChallange(client.id, true);

            if (challangeData) {
                const allSockets = getAllActiveSockets();
                const opponentSocket = allSockets[challangeData.challangerID];
                
                client.emit('challange-answer', choice);
                opponentSocket.emit('challange-answer', choice);
            }
        })

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