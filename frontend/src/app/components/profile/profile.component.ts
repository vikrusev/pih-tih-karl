import { Component, OnInit } from '@angular/core';

import { UsersService } from 'src/app/services/users.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    user: IExtendedUser = null;
    profileError: String = null;

    constructor(private userService: UsersService) { }

    ngOnInit() {
        this.user = this.userService.getCurrentUser();
    }

    async updateData() {
        console.log(this.user)
        // const newUser: IExtendedUser = await this.userService.updateUser(this.user);
        // this.userService.setCurrentUser(newUser);
    }

}
