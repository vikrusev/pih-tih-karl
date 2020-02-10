import { Component, OnInit } from '@angular/core';

import { UsersService } from '../../services/users.service';

interface ITableUser {
    email: String,
    username: String,
    wins: Number,
    losses: Number
}

@Component({
    selector: 'app-race',
    templateUrl: './race.component.html',
    styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

    onlineUsers: ITableUser[] = [];
    displayColumns: string[] = ['username', 'email', 'wins', 'losses'];
    autoRefreshTableMS: number = 3000;

    constructor(private usersService: UsersService) { }

    async ngOnInit() {
        setTimeout(async () => {
            this.onlineUsers = await this.prepareTableData() || [];

            setInterval(async () => {
                this.onlineUsers = await this.prepareTableData() || [];
            }, this.autoRefreshTableMS);
        }, 1000);

    }

    filterPredicate(user: IBasicUser, filterValue: string): Boolean {
        return user.username.includes(filterValue) || user.email.includes(filterValue);
    }

    private async prepareTableData(): Promise<ITableUser[]> {
        try {
            const allUsers: IBasicUser[] = await this.usersService.getAllOnlineUsers();

            let cleanDataSource: ITableUser[] = allUsers.map((user) => {
                let obj = {
                    email: user.email,
                    username: user.username,
                    wins: user.wins,
                    losses: user.losses
                }

                return obj;
            });

            const currentUser = this.usersService.getCurrentUser();
            cleanDataSource = cleanDataSource.filter((user: ITableUser) => user.username !== currentUser.username);
            
            return cleanDataSource;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }

}
