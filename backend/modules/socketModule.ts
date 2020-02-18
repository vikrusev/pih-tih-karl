const io = require('socket.io');

import { appLog } from './helpers/logHelper'
import UserModel from '../schemas/user';

interface PlayerData {
    socketID: string,
    readyState: boolean
}

interface ActiveChallange {
    challangerData: PlayerData,
    opponentData: PlayerData
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

    const getOpponentSocket = (ownId: string, challangeData: ActiveChallange): any => {
        const allSockets = getAllActiveSockets();

        if (ownId === challangeData.challangerData.socketID) {
            return allSockets[challangeData.opponentData.socketID];
        }

        return allSockets[challangeData.challangerData.socketID];
    }

    const playersData = (ownId: string, challangeData: ActiveChallange): PlayerData[] => {
        if (ownId === challangeData.opponentData.socketID) {
            return [challangeData.opponentData, challangeData.challangerData];
        }

        return [challangeData.challangerData, challangeData.opponentData];
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

        let socketUsername: String = null;
        for (const socket in allActiveSockets) {
            socketUsername = getSocketUsername(allActiveSockets[socket]);

            if (username === socketUsername) {
                return allActiveSockets[socket];
            }
        }

        return null;
    }

    const findActiveChallange = (id: String): ActiveChallange => {
        for (const challange of activeChallanges) {
            if (challange.challangerData.socketID === id || challange.opponentData.socketID === id) {
                return challange;
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
                    challangerData: {
                        socketID: client.id,
                        readyState: false
                    },
                    opponentData: {
                        socketID: opponentSocket.id,
                        readyState: false
                    }
                }
                activeChallanges.push(newChallange)

                opponentSocket.emit('incoming-challange', data);
            }
            else {
                client.emit('user-not-found', `Opponent ${username} was not found!`);
            }
        })

        client.on('answer-challange', (choice: Boolean) => {
            const challangeData: ActiveChallange = findActiveChallange(client.id);

            if (challangeData) {
                const opponentSocket = getOpponentSocket(client.id, challangeData);
                const activeCar: boolean = !!Math.round(Math.random());

                client.emit('challange-answer', { choice, activeCar });
                opponentSocket.emit('challange-answer', { choice, activeCar: !activeCar });
            }
        });

        client.on('ready-own', (ready: boolean) => {
            const challangeData: ActiveChallange = findActiveChallange(client.id);

            if (challangeData) {
                if (ready) {
                    let [ownData, opponentData] = playersData(client.id, challangeData);

                    ownData.readyState = true;

                    if (opponentData.readyState) {
                        const opponentSocket = getOpponentSocket(client.id, challangeData);

                        let count = 5;
                        let interval = setInterval(() => {
                            client.emit('race-counter', count);
                            opponentSocket.emit('race-counter', count);

                            count--;

                            if (count === -1) { clearInterval(interval); }
                        }, 1000);
                    }
                }
            }
        });

        client.on('report-own', (report: GameReportSmall) => {
            const challangeData: ActiveChallange = findActiveChallange(client.id);

            if (challangeData) {
                const opponentSocket = getOpponentSocket(client.id, challangeData);
                opponentSocket.emit(`report-opponent-${report.type}`, report.value);
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