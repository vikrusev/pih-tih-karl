import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { GameCanvas } from './game.class'
import { UserSocketService } from 'src/app/services/user-socket.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

    // TO-DO: disable challange popup if already in a challange
    socket: any = null;
    gameCanvas: GameCanvas = null;

    @ViewChild('game3d') game3d: ElementRef;

    constructor(private socketService: UserSocketService) { }

    ngOnInit() {
        this.socket = this.socketService.getCurrentSocket();

        this.socketService.outgoingChallange$.subscribe((data: ChallangeAnswer) => {
            if (data && data.choice) {
                this.initGame(data.activeCar);
            }
        });

        // add global event listeners
        // TODO: clear event listeners on destroy and challange end
        document.addEventListener("keydown", (e: KeyboardEvent) => this.gameCanvas.onDocumentKeyDown(e), false);
        document.addEventListener("keyup", (e: KeyboardEvent) => this.gameCanvas.onDocumentKeyUp(e), false);

        window.addEventListener('resize', () => this.gameCanvas.onWindowResize(), false);
    }

    initGame(activeCar: Boolean): void {
        this.gameCanvas = new GameCanvas(this.game3d, activeCar);

        this.socket.on('report-opponent-position', (position: number) => {
            this.gameCanvas.setOpponentPosition(position);
        });

        this.gameCanvas.getReporter().subscribe((report: GameReport) => {
            if (report) {
                console.log(report.data)
                this.socket.emit('answer-challange', report.data);
            }
        });
    }

}
