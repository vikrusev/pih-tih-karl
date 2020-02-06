import { Component, OnInit } from '@angular/core';

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

    constructor() { }

    ngOnInit() {
    }

}
