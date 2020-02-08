import { Injectable } from "@angular/core";

import * as io from 'socket.io-client'
import { environment } from '../../environments/environment'

@Injectable()
export class UserSocketService {

    static socket = null;

    constructor() { }

    createSocket() {
        const isUserLogged = sessionStorage.getItem('isLogged');

        if (isUserLogged && !UserSocketService.socket) {
            this.setSocket();
            
            UserSocketService.socket.on('disconnect', () => {
                UserSocketService.socket = UserSocketService.socket.close();
                sessionStorage.removeItem('isLogged');
            });
        }
    }

    getCurrentSocket() {
        return UserSocketService.socket;
    }

    setSocket() {
        UserSocketService.socket = io(environment.backendUrl);
    }

    disconnectSocket() {
        UserSocketService.socket.emit('logout-disconnect');
    }

}
