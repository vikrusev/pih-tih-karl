import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.layout.html',
    styleUrls: ['./navbar.layout.scss']
})
export class NavbarLayout {
    isLogged: boolean;

    constructor(private auth: AuthService) { }

    logout() {
        this.auth.logout();
    }

}