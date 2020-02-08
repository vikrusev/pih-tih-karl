import { Component } from '@angular/core';

import { UserSocketService } from './services/user-socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private userSocketService: UserSocketService) { 
        this.userSocketService.createSocket();
    }

}
