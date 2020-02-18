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

    gameText: string = "waiting server..";

    @ViewChild('game3d') game3d: ElementRef;

    constructor(private socketService: UserSocketService) { }

    ngOnInit() {
        this.socket = this.socketService.getCurrentSocket();
        
        this.socketService.outgoingChallange$.subscribe((data: ChallangeAnswer) => {
            if (data && data.choice) {
                this.initGame(data.activeCar);
            }
        });

        this.socket.on('race-counter', (count: number) => {
            this.gameText = (count || "Go!").toString();
            this.gameCanvas.gameStarted = !!!+this.gameText; //muhahahahahahhsdahjfsakhkjfda
        });

        // add global event listeners
        // TODO: clear event listeners on destroy and challange end
        document.addEventListener("keydown", (e: KeyboardEvent) => this.gameCanvas.onDocumentKeyDown(e), false);
        document.addEventListener("keyup", (e: KeyboardEvent) => this.gameCanvas.onDocumentKeyUp(e), false);

        window.addEventListener('resize', () => this.gameCanvas.onWindowResize(), false);
    }

    initGame(activeCar: Boolean): void {
        this.gameCanvas = new GameCanvas(this.game3d, activeCar);

        this.gameCanvas.canvasReady$.subscribe((ready: boolean) => {
            if (ready) {
                this.socket.emit('ready-own', true);
            }
        });

        this.socket.on('report-opponent-position', (position: number) => {
            this.gameCanvas.setOpponentPosition(position);
        });

        this.gameCanvas.getReporter().subscribe((report: GameReport) => {
            if (report) {
                this.socket.emit('report-own', report.data);
            }
        });
    }

}
