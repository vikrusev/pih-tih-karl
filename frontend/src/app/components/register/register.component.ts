import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    private username: String;
    private email: String;
    private password: String;
    private confPassword: String;

    constructor() { }

    ngOnInit() {
    }

}
