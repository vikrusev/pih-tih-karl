const io = require('socket.io')

import { appLog } from '../../modules/helpers/logHelper'

export default class SocketService {

    private socketIO = null;

    constructor() { }

    init(server): void {
        this.socketIO = io(server);
    }

    start(): void {
        this.awaitEvents();
    }

    private awaitEvents(): void {
        this.socketIO.on('connection', (client) => {
            appLog('info', 'A user has connected')

            setInterval(() => {
                for (let socket of Object.keys(this.socketIO.sockets.sockets)) {
                    console.log(socket)
                }
            }, 1000)

            this.awaitClientEvents(client);
        });
    }

    private awaitClientEvents(client): void {
        client.on('logout-disconnect', () => {
            appLog('info', 'A user has disconnected');
            client.disconnect();
        });
    }

}