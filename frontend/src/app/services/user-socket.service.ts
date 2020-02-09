import { Injectable } from "@angular/core";

import * as io from 'socket.io-client'
import { environment } from '../../environments/environment'
import { UsersService } from './users.service'

@Injectable()
export class UserSocketService {

    static socket = null;

    constructor(private usersService: UsersService) { }

    createSocket() {
        const hasLogged = this.usersService.hasLogged();

        if (hasLogged && !UserSocketService.socket) {
            this.setSocket();
            
            UserSocketService.socket.on('disconnect', () => {
                UserSocketService.socket = UserSocketService.socket.close();
                this.usersService.removeItem('isLogged');
            });
        }
    }

    getCurrentSocket() {
        return UserSocketService.socket;
    }

    setSocket() {
        const currentUser = this.usersService.getCurrentUser();
        UserSocketService.socket = io(environment.backendUrl, { query: `username=${currentUser.username}` });
    }

    disconnectSocket() {
        UserSocketService.socket.emit('logout-disconnect');
    }

}
