import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  private username: String;
  private password: String;

  constructor() { }

  ngOnInit() {
  }

  onLogin() {
  }

}
