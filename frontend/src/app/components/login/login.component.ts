import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    username: String;
    password: String;

    loginError: String = null;

    constructor(private auth: AuthService, private router: Router) { }

    async onLogin() {
        try {
            let res = await this.auth.login(this.username, this.password);

            if (res.token) {
                this.auth.setData(res.token, res.user);
                this.router.navigate(['/']);
            }
        }
        catch (err) {
            this.loginError = err.error.message;
        }
    }

}
