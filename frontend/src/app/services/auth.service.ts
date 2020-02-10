import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Subject, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators'

import { UserSocketService } from './user-socket.service';
import { UsersService } from './users.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    token: string;

    constructor(
        private http: HttpClient, private router: Router,
        private userSocketService: UserSocketService,
        private usersService: UsersService) {
        const jwt = localStorage.getItem('JWT');
        let jwtParsed;
        if (jwt) {
            jwtParsed = this.parseJwt(jwt);
        }

        if (jwtParsed
            && jwtParsed.exp
            && jwtParsed.user
            && (new Date).getTime() / 1000 < jwtParsed.exp) {
            this.token = jwt;
            // this.user = jwtParsed.user;
            // this.user$.next(this.user);
        }
    }

    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    login(username: String, password: String) {
        this.http.post(`/api/login`, { username, password })
            .pipe(
                tap((data: any) => {
                    if (data.token) {
                        this.usersService.login(data.user);
                        // this.user = data.user;
                        this.token = data.token;
                        // this.user$.next(this.user);
                        localStorage.setItem("JWT", data.token);
                        this.userSocketService.createSocket();
                        this.router.navigate(['/']);
                    } else if (data.error) {
                        console.log(data.error);
                    } else {
                        console.log(data);
                    }
                })
            )
            .subscribe((data) => { }, (err) => {
                err();
                console.log(err); // add message service
            });
    }

    logout() {
        localStorage.removeItem('JWT');
        this.userSocketService.disconnectSocket();
        this.router.navigate(['/']);
    }

    isLogged(): Boolean {
        return this.usersService.hasLogged() && this.userSocketService.getCurrentSocket();
    }
}
