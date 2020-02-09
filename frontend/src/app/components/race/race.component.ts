import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-race',
    templateUrl: './race.component.html',
    styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

    onlineUsers: any = null;
    displayedColumns: string[] = ['username', 'email'];

    constructor(private usersService: UsersService) { }

    async ngOnInit() {
        this.onlineUsers = await this.prepareTableTable();
        this.onlineUsers.filterPredicate = this.filterPredicate;
    }
    
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.onlineUsers.filter = filterValue.trim().toLowerCase();
    }
    
    private filterPredicate(user: IBasicUser, filterValue: string): Boolean {
        return user.username.includes(filterValue) || user.email.includes(filterValue);
    }

    private async prepareTableTable(): Promise<MatTableDataSource<IBasicUser>> {
        try {
            let dataSource: IBasicUser[] = await this.usersService.getAllOnlineUsers();

            const currentUser = this.usersService.getCurrentUser();
            dataSource = dataSource.filter((user: IBasicUser) => user.username !== currentUser.username);

            return new MatTableDataSource(dataSource);
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }

}
