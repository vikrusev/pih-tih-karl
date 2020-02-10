import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'

@Injectable()
export class UsersService {

    constructor(private http: HttpClient) { }

    getAllOnlineUsers(): Promise<IBasicUser[]> {
        return this.http.get<IBasicUser[]>('/users/online').toPromise();
    }

    getCurrentUser() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user;
    }

    setCurrentUser(userData): void {
        const user = JSON.stringify(userData);
        sessionStorage.setItem('user', user);
    }

    removeItem(itemKey): void {
        sessionStorage.removeItem(itemKey)
    }

    hasLogged(): Boolean {
        const user = this.getCurrentUser();
        return user && user.isLogged;
    }

}
