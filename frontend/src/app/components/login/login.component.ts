import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  onLogin() {
    this.auth.login(this.username, this.password);
  }

}
