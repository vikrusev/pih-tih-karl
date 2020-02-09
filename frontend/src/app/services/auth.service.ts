import { Injectable } from '@angular/core';
import { Router } from "@angular/router"
import { HttpClient } from '@angular/common/http';

import { UserSocketService } from './user-socket.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router, private userSocketService: UserSocketService) { }

    login(username: String, password: String) {
        this.http.post(`/api/login`, { username, password })
            .subscribe((data: any) => {
                console.log(data);

                sessionStorage.setItem('isLogged', 'true');
                this.userSocketService.createSocket();
                this.router.navigateByUrl('/')
            }, (err) => {
                console.log(err);
            });
    }
}
