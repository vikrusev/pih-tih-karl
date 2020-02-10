import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.layout.html',
    styleUrls: ['./navbar.layout.scss']
})
export class NavbarLayout {

    constructor(public auth: AuthService, public userService: UsersService) { }

    logout() {
        this.auth.logout();
    }

}