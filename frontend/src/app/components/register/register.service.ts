import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'

interface CheckFields {
    username: String,
    email: String
}

@Injectable({
    providedIn: 'root'
})
export class RegisterService {

    constructor(private http: HttpClient) { }

    register(registerData) {
        return this.http.post('/api/register', registerData).toPromise();
    }

    checkAvailability(fields: CheckFields): Promise<any> {
        return this.http.post<any>('/api/register/availability', fields).toPromise();
    }

}
