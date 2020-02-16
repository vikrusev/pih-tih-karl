import { Component, OnInit } from '@angular/core';

import { UserSocketService } from '../../services/user-socket.service'

@Component({
    selector: 'app-race',
    templateUrl: './race.component.html',
    styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

    showChallangePopup: Boolean = false;

    challangeTitle: String = 'Challange a player';
    challangeBody: String = null;

    challangeUsername: String = null;

    buttonConfirmText: String = 'Challange!';
    buttonDeclineText: String = 'Flee...';

    constructor(private userSocketService: UserSocketService) {
        this.userSocketService.outgoingChallange$.subscribe((data: ChallangeAnswer) => {
            this.showChallangePopup = data ? data.choice : false;
        });
    }

    ngOnInit() { }

    challangePopup(username: String): void {
        this.challangeUsername = username;
        this.challangeBody = `You are about to challange ${username}`;

        this.showChallangePopup = true;
    }

    confirmChallange(): void {
        const socket = this.userSocketService.getCurrentSocket();
        socket.emit('challange-player', this.challangeUsername);
    }

}
