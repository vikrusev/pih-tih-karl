import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user$: Observable<IBasicUser>;

    constructor(private http: HttpClient) { }

    login(username: String, password: String) {
        this.http.post(`/api/login`, { username, password })
            .subscribe((data: any) => {
                if (data.token) {
                    console.log("yes")
                } else if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data);
                }
            }, (err) => {
                console.log(err); // add message service
            });
    }
}
