import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { GeneralPopupComponent } from './components/general-popup/general-popup.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        GeneralPopupComponent
    ],
    exports: [
        GeneralPopupComponent
    ]
})

export class SharedModule { }