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
