import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RegisterService } from './register.service'

interface RegisterData {
    username: String,
    email: String,
    password: String,
    confPassword: String
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

    data: RegisterData = {
        username: '',
        email: '',
        password: '',
        confPassword: ''
    };
    hints: RegisterData = {
        username: '',
        email: '',
        password: '',
        confPassword: ''
    };

    formValid: Boolean = false;
    registerError: String = null;
    
    constructor(private router: Router, private registerService: RegisterService) { }

    async register() {

        this.validateForm();
        await this.checkAvailability();

        if (this.formValid) {
            const registerData = {
                username: this.data.username,
                email: this.data.email,
                password: this.data.password,
                confPassword: this.data.confPassword
            };

            try {
                await this.registerService.register(registerData);
                this.router.navigateByUrl('/login');
            }
            catch (err) {
                this.registerError = err.error.message;
            }
        }
    }

    validateForm(): void {
        this.registerError = null;
        
        if (this.data.email && this.data.username && this.checkPasswords()) {
            this.formValid = true;
        }
        else {
            this.formValid = false;
        }
    }

    private async checkAvailability() {
        const checkFields = {
            username: this.data.username,
            email: this.data.email
        }

        try {
            const availability = await this.registerService.checkAvailability(checkFields);
            const takenFields = availability.data;

            if (availability.data.length) {
                this.formValid = false;

                for (let f in takenFields) {
                    this.hints[takenFields[f]] = `${takenFields[f]} is taken`;
                }
            }
            else {
                this.formValid = true;
            }
        }
        catch (err) {
            this.registerError = err.error.message;
            this.formValid = false;
        }
    }

    checkPasswords(): Boolean {
        if (this.data.password || this.data.confPassword) {
            if (this.data.password === this.data.confPassword) {
                this.hints.password = '';
                this.hints.confPassword = '';
                return true;
            }
            else {
                this.hints.password = 'Missmatch';
                this.hints.confPassword = 'Missmatch';
                return false;
            }
        }

        return false;
    }

}
