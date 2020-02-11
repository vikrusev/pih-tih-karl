import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    user$: Subject<IExtendedUser> = new BehaviorSubject<IExtendedUser>(null);

    user: IExtendedUser = null;

    constructor(private http: HttpClient) { }

    getAllOnlineUsers(): Promise<IExtendedUser[]> {
        return this.http.get<IExtendedUser[]>('/users/online').toPromise();
    }

    updateUser(personalData): Promise<IExtendedUser> {
        return this.http.patch<IExtendedUser>('/users/update-profile', personalData).toPromise();
    }

    getCurrentUser(): IExtendedUser {
        return this.user;
    }

    getCurrentUsername(): String {
        return this.user ? this.user.username : null;
    }

    setCurrentUser(user: IExtendedUser) {
        this.user = user;
        this.user$.next(this.user);
    }

    hasLogged(): Boolean {
        return this.user !== null;
    }

}
