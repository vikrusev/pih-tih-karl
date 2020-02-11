import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { UsersService } from '../../../services/users.service';

interface ITableUser {
    email: String,
    username: String,
    wins: Number,
    losses: Number
}

@Component({
    selector: 'race-mat-table',
    templateUrl: './race-mat-table.component.html',
    styleUrls: ['./race-mat-table.component.scss']
})
export class RaceMatTableComponent implements OnInit {

    onlineUsers: MatTableDataSource<ITableUser>;
    displayColumns: string[] = ['username', 'email', 'wins', 'losses'];

    refresh: boolean = true;
    autoRefreshTableMS: number = 20000;

    tableRefreshInterval = null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private usersService: UsersService) { }

    ngOnInit() {
        this.startTimers(1000);
    }

    private startTimers(timeout: number): void {
        setTimeout(async () => {
            await this.setData();

            this.tableRefreshInterval = setInterval(async () => {
                if (this.refresh) {
                    await this.setData()
                }
            }, this.autoRefreshTableMS);
        }, timeout);
    }

    private async setData() {
        this.onlineUsers = await this.prepareTableData();
        this.onlineUsers.filterPredicate = this.filterPredicate;
        this.onlineUsers.paginator = this.paginator;
    }

    filterPredicate(user: ITableUser, filterValue: string): boolean {
        return user.username.includes(filterValue) || user.email.includes(filterValue);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;

        if (filterValue) {
            this.refresh = false;
        }
        else {
            this.refresh = true;
        }

        this.onlineUsers.filter = filterValue.trim().toLowerCase();
    }

    refreshTable(): void {
        clearInterval(this.tableRefreshInterval);
        this.startTimers(200);
    }

    private async prepareTableData(): Promise<MatTableDataSource<ITableUser>> {
        try {
            let allUsers: IExtendedUser[] = await this.usersService.getAllOnlineUsers();
            const currentUsername: String = this.usersService.getCurrentUsername();

            allUsers = allUsers.filter((user: ITableUser) => user.username !== currentUsername);

            return new MatTableDataSource(allUsers);
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }

}
