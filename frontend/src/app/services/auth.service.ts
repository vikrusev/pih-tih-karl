import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { UserSocketService } from './user-socket.service';
import { UsersService } from './users.service';

import { tap } from 'rxjs/operators'

interface Token {
    exp: number,
    user: IExtendedUser
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    token: string = null;

    constructor(
        private http: HttpClient, private router: Router,
        private userSocketService: UserSocketService,
        private usersService: UsersService
    ) {
        const jwt: string = localStorage.getItem('JWT');
        let jwtParsed: Token = null;

        if (jwt) {
            jwtParsed = this.parseJwt(jwt);
        }

        const currentTime = (new Date).getTime() / 1000;

        if (jwtParsed
            && jwtParsed.exp
            && jwtParsed.user
            && currentTime < jwtParsed.exp) 
        {
            this.setData(jwt, jwtParsed.user);
        }
    }

    private parseJwt(token): Token {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    private setData(token: string, user: IExtendedUser): void {
        this.token = token;
        this.usersService.setCurrentUser(user);
        this.userSocketService.createSocket();

        localStorage.setItem('JWT', token);
    }

    login(username: String, password: String): void {
        this.http.post(`/api/login`, { username, password })
            .pipe(
                tap((data: any) => {
                    if (data.token) {
                        this.setData(data.token, data.user);

                        this.router.navigate(['/']);
                    }
                    else {
                        console.log(data.error || data);
                    }
                })
            )
            .subscribe((data) => { }, (err) => {
                console.log(err); // add message service
            });
    }

    logout() {
        localStorage.removeItem('JWT');
        this.usersService.setCurrentUser(null);
        this.userSocketService.disconnectSocket();
        this.router.navigate(['/']);
    }

    isLogged(): Boolean {
        return this.usersService.hasLogged() && (this.userSocketService.getCurrentSocket() !== null);
    }
}
