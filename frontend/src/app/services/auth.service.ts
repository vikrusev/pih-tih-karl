import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    login(username: String, password: String) {
        this.http.post(`/api/login`, { username, password })
            .subscribe((data: any) => {
                console.log(data);
            }, (err) => {
                console.log(err);
            });
    }
}
