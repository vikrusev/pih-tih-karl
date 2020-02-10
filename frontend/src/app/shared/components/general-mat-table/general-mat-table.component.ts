import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'general-mat-table',
    templateUrl: './general-mat-table.component.html',
    styleUrls: ['./general-mat-table.component.scss']
})
export class GeneralMatTableComponent implements OnInit {


    @Input() set dataSource(data: any[]) {
        if (this.refresh) {
            this.listData = new MatTableDataSource(data);
            this.listData.filterPredicate = this.filterPredicate;
        }
    }
    @Input() displayColumns: string[];
    @Input() filterPredicate: (data: any, filter: any) => boolean;
    
    listData: MatTableDataSource<any>;
    refresh: boolean = true;

    constructor() { }

    ngOnInit() { }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;

        if (filterValue) {
            this.refresh = false;
        }
        else {
            this.refresh = true;
        }

        this.listData.filter = filterValue.trim().toLowerCase();
    }

}
