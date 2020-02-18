import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'general-popup',
    templateUrl: './general-popup.component.html',
    styleUrls: ['./general-popup.component.scss']
})

export class GeneralPopupComponent {

    constructor() { }

    /**
     * Make the popup visible or not
     */
    @Input() display: boolean = false;

    /**
     * Buttons for confirm / decline
     */
    @Input() buttonTextConfirm: string = null;
    @Input() buttonTextDecline: string = null;

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

    confirm(): void {
        this.onConfirm.emit(true);
    }

    decline(): void {
        this.onDecline.emit(true);
    }

    close(): void {
        this.onClose.emit(true);
    }

}