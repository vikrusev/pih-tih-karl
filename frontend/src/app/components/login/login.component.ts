import { Component, OnInit } from '@angular/core';

import * as io from 'socket.io-client'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    username: String;
    password: String;

    constructor() { }

    ngOnInit() {
    }

    onLogin() {
        const socket = io('http://localhost:3000');

        socket.on('connect', (data) => {
            socket.emit('join', 'Hello World from client');
        });

        socket.on('messages', (data) => {
            alert(data);
        });
    }

}
