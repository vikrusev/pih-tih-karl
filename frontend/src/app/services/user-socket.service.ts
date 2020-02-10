import { Injectable } from "@angular/core";

import * as io from 'socket.io-client'
import { environment } from '../../environments/environment'
import { UsersService } from './users.service'

@Injectable({
    providedIn: 'root'
})
export class UserSocketService {

    socket = null;

    constructor(private usersService: UsersService) { }

    createSocket(): void {
        const hasLogged = this.usersService.hasLogged();

        if (hasLogged && !this.socket) {
            this.setSocket();
            
            this.socket.on('disconnect', () => {
                this.socket = this.socket.close();
            });
        }
    }

    getCurrentSocket() {
        return this.socket;
    }

    setSocket() {
        const currentUser: IBasicUser = this.usersService.getCurrentUser();

        if (currentUser) {
            this.socket = io(environment.backendUrl, { query: `username=${currentUser.username}` });
        }
        else {
            console.log('no user');
        }
    }

    disconnectSocket() {
        this.socket.emit('logout-disconnect');
    }

}
