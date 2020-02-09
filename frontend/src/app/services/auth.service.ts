import { Injectable } from '@angular/core';
import { Router } from "@angular/router"
import { HttpClient } from '@angular/common/http';

import { UserSocketService } from './user-socket.service';
import { UsersService } from './users.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router, private userSocketService: UserSocketService, private usersService: UsersService) { }

    login(username: String, password: String) {
        this.http.post(`/api/login`, { username, password })
            .subscribe((data: any) => {
                this.usersService.setCurrentUser(data.userData);
                this.userSocketService.createSocket();
                this.router.navigateByUrl('/')
            }, (err) => {
                console.log(err);
            });
    }

    isLogged(): Boolean {
        return this.usersService.hasLogged() && this.userSocketService.getCurrentSocket();
    }
}
