import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { GeneralMatTableComponent } from './components/general-mat-table/general-mat-table.component';

// Material modules
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    imports: [
        CommonModule,
        MatSliderModule,
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule
    ],
    declarations: [
        GeneralMatTableComponent
    ],
    exports: [
        GeneralMatTableComponent
    ]
})

export class SharedModule { }