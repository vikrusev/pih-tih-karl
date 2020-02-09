import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"

import { AuthService } from 'src/app/services/auth.service';
import { UserSocketService } from '../../services/user-socket.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    username: String;
    password: String;

    
    constructor(private router: Router, private userSocketService: UserSocketService, private auth: AuthService) { }

    ngOnInit() {
    }


    onLogin() {
        this.auth.login(this.username, this.password);
      
        sessionStorage.setItem('isLogged', 'true');
        this.userSocketService.createSocket();
        // this.router.navigateByUrl('/')
    }

}
