import { Component, OnInit } from '@angular/core';

import { UserSocketService } from '../../services/user-socket.service'

@Component({
    selector: 'app-race',
    templateUrl: './race.component.html',
    styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

    showChallangePopup: Boolean = false;

    challangeTitle: String = null;
    challangeBody: String = null;

    challangeUsername: String = null;

    buttonConfirmText: String = null;
    buttonDeclineText: String = null;

    constructor(private userSocketService: UserSocketService) {
        this.userSocketService.outgoingChallange$.subscribe((data: ChallangeAnswer) => {
            if (data) {
                if (data.choice) {
                    this.showChallangePopup = false;
                }
                else {
                    this.challangeBody = `${this.challangeUsername} has declined!`
                    this.buttonDeclineText = 'Close';
                    this.buttonConfirmText = null;
                }
            }
        });
    }

    ngOnInit() { }

    challangePopup(username: String): void {
        // load default texts
        this.challangeTitle = 'Challange a player';
        this.challangeBody = `You are about to challange ${this.challangeUsername}`;

        this.challangeUsername = username;

        this.buttonConfirmText = 'Challange!';
        this.buttonDeclineText = 'Flee...';

        this.showChallangePopup = true;
    }

    confirmChallange(): void {
        const socket = this.userSocketService.getCurrentSocket();
        socket.emit('challange-player', this.challangeUsername);
    }

}
