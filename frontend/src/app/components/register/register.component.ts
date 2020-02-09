import { Component, OnInit } from '@angular/core';

import { UserSocketService } from '../../services/user-socket.service';

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

    constructor(private userSocketService: UserSocketService) { 
        const socket = this.userSocketService.getCurrentSocket();

        socket.emit('join', 'Hello from client');

        userSocketService.disconnectSocket();
    }

    ngOnInit() {
    }

}
