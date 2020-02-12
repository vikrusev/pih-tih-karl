import { Component, OnInit } from '@angular/core';
import moment from 'moment';

import { UsersService } from 'src/app/services/users.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    user: IExtendedUser = null;
    profileError: String = null;

    birthDate: string = null;

    constructor(private userService: UsersService) { }

    ngOnInit() {
        this.user = this.userService.getCurrentUser();
        this.birthDate = this.setUserBirthDate(this.user.profile.birthDate);
    }

    async updateData() {
        try {
            this.user.profile.birthDate = new Date(this.birthDate);

            const newUser: IExtendedUser = await this.userService.updateUser(this.user);
            this.userService.setCurrentUser(newUser);
        }
        catch (err) {
            this.profileError = err.error.message;
        }
    }

    private setUserBirthDate(birthDate: Date): string {
        return moment(birthDate).format('YYYY-MM-DD');
    }

}
