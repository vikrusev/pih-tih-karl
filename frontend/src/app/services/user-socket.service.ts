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
            this.setSocketEvents();
        }
    }

    getCurrentSocket() {
        return this.socket;
    }

    disconnectSocket() {
        this.socket.emit('logout-disconnect');
    }

    private setSocket() {
        const currentUser: IBasicUser = this.usersService.getCurrentUser();

        if (currentUser) {
            this.socket = io(environment.backendUrl, { path: `${environment.customPath}/socket.io`, query: `username=${currentUser.username}` });
        }
        else {
            console.log('no user');
        }
    }

    private setSocketEvents(): void {
        this.socket.on('disconnect', () => {
            this.socket = this.socket.close();
            this.socket = null;
        });

        this.socket.on('connect_timeout', (timeout) => {
            console.log(`socket connect_timeout: ${timeout}`)
        });

        this.socket.on('error', (error) => {
            console.log(`socket error: ${error}`)
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`socket reconnect: ${attemptNumber}`)
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`socket reconnect_attempt: ${attemptNumber}`)
        });

        this.socket.on('reconnecting', (attemptNumber) => {
            console.log(`socket reconnecting: ${attemptNumber}`)
        });

        this.socket.on('reconnect_error', (error) => {
            console.log(`socket reconnect_error: ${error}`)
        });

        this.socket.on('reconnect_failed', () => {
            console.log('socket reconnect_failed')
        });
    }

}
