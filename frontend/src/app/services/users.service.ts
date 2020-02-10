import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class UsersService {

    user$: Subject<IBasicUser> = new BehaviorSubject<IBasicUser>(null);

    user;

    constructor(private http: HttpClient) { }

    getAllOnlineUsers(): Promise<IBasicUser[]> {
        return this.http.get<IBasicUser[]>('/users/online').toPromise();
    }

    getCurrentUsername(): String {
        return this.auth.getUsername();
    }

    setCurrentUser(userData): void {
        const user = JSON.stringify(userData);
        sessionStorage.setItem('user', user);
    }

    removeItem(itemKey): void {
        sessionStorage.removeItem(itemKey)
    }

    login(user: any) {
        throw new Error("Method not implemented.");
    }

    hasLogged(): Boolean {
        return this.user !== null;
    }

}
