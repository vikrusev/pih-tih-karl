import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'general-popup',
    templateUrl: './general-popup.component.html',
    styleUrls: ['./general-popup.component.scss']
})

export class GeneralPopupComponent {

    constructor() { }

    hasConfirmButton = false;
    hasDeclineButton = false;
    
    /**
     * Make the popup visible or not
     */
    @Input() display: boolean = false;

    /**
     * Buttons for confirm / decline
     */
    @Input() buttonTextConfirm: string;
    @Input() buttonTextDecline: string;

    /**
     * Data to be displayed
     */
    @Input() titleText: string;
    @Input() bodyText: string;

    /**
     * Loading
     */
    @Input() pendingRequest: Boolean = false;

    /**
     * Event emitters
     */
    @Output() onConfirm = new EventEmitter<Boolean>();
    @Output() onDecline = new EventEmitter<Boolean>();
    @Output() onClose = new EventEmitter<Boolean>();

    ngOnInit() {
        if (this.buttonTextConfirm) {
            this.hasConfirmButton = true;
        }
        if (this.buttonTextDecline) {
            this.hasDeclineButton = true;
        }
    }

    confirm(): void {
        this.onConfirm.emit(true);
    }

    decline(): void {
        this.onDecline.emit(true);
    }

    close(): void {
        this.display = false;
        this.onClose.emit(true);
    }

}