import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserSocketService } from '../../services/user-socket.service'

@Component({
    selector: 'app-main-layout',
    templateUrl: './main.layout.html',
    styleUrls: ['./main.layout.scss']
})
export class MainLayout {

    challangeTitle: String = 'Incoming challange!';
    challangeBody: String = null;
    buttonConfirmText: String = 'Confirm';
    buttonDeclineText: String = 'Decline';
    showChallangePopup: Boolean = false;

    constructor(private router: Router, private userSocketService: UserSocketService) {
        this.userSocketService.incomingChallange$.subscribe((data) => {
            if (data) {
                this.challangeBody = `${data.username} has challanged you`;
                this.showChallangePopup = true;
            }
        });
    }

    confirmChallange() {
        const socket = this.userSocketService.getCurrentSocket();
        socket.emit('answer-challange', true);

        this.showChallangePopup = false;
        this.router.navigateByUrl('/race');
    }

    declineChallange() {
        const socket = this.userSocketService.getCurrentSocket();
        socket.emit('answer-challange', false);

        this.showChallangePopup = false;
    }

}