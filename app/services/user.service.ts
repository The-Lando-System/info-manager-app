import { Injectable, EventEmitter } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { Broadcaster } from './broadcaster';

@Injectable()
export class LoginService {

  private loginUrl = 'http://localhost:8080/auth/login';
  private logoutUrl = 'http://localhost:8080/auth/logout';
  
  constructor(
    private http: Http,
    private cookieService: CookieService,
    private broadcaster: Broadcaster,
    private token: String,
    private loginHeaders = new Headers({
      'Authorization'  : 'Basic ' + btoa('sarlacc:deywannawanga')
    })
  ){}

  getAuthHeaders(): Headers {
    return new Headers({
      'Content-Type'   : 'application/json',
      'x-access-token'  : this.getToken()
    })
  }

  getLoginHeaders(username:String, password:String): Headers {
    return new Headers({
      'Authorization'  : 'Basic ' + btoa(username + ':' + password);
    })
  }

  login(creds: any): void {
    this.http.post(this.loginUrl, {}, {headers: this.getLoginHeaders(creds.username,creds.password)})
    .toPromise()
    .then(res=>{
      var token = res.json();
      this.cookieService.put('access-token',token.access_token);
      this.broadcaster.broadcast('Login','The user logged in');
      this.token = token.access_token;
    });
  }

  logout(): void {
    // /auth/logout
    this.http.post(this.logoutUrl, {}, {})
    .toPromise()
    .then(res=>{
      this.cookieService.remove('access-token');
      this.broadcaster.broadcast('Logout','The user logged out');
      this.token = '';
    });
  }

  getToken(): String {
    if (!this.token){
      this.token = this.cookieService.get('access-token');
    }
    if (!this.token){
      this.logout();
    }
    return this.token;
  }

}