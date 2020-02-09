import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    username: String;
    email: String;
    password: String;
    confPassword: String;

    constructor(private http: HttpClient, private router: Router) {
    }

    ngOnInit() {
    }

    register() {
        this.http.post('/api/register', { username: this.username, password: this.password, email: this.email }).subscribe(res => { console.log(res); this.router.navigateByUrl('/login') });
    }

}
