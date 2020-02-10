import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from '../services/auth.service';

@Injectable()
export class LoggedUserGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router, private auth: AuthService) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        const isLogged = this.auth.isLogged();

        if (!isLogged) {
            this.router.navigateByUrl('/login');
            return false;
        }

        return true;
    }

    canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate();
    }
}