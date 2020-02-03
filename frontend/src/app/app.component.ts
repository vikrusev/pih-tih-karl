import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'pih-tih-karl';
  proxyResponse: string = '';

  constructor(private http: HttpClient) { }

  async testProxy() {
    const test: BasicUserModel = null;
    this.http.get('/test-proxy', { responseType: 'text' }).subscribe(res => this.proxyResponse = res);
  }
}
