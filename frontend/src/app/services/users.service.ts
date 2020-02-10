import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class UsersService {

    user$: Subject<IBasicUser> = new BehaviorSubject<IBasicUser>(null);

    user: IBasicUser = null;

    constructor(private http: HttpClient) { }

    getAllOnlineUsers(): Promise<IBasicUser[]> {
        return this.http.get<IBasicUser[]>('/users/online').toPromise();
    }

    getCurrentUser(): IBasicUser {
        return this.user;
    }

    getCurrentUsername(): String {
        return this.user ? this.user.username : null;
    }

    setCurrentUser(user: IBasicUser) {
        this.user = user;
        this.user$.next(this.user);
    }

    hasLogged(): Boolean {
        return this.user !== null;
    }

}
