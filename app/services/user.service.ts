import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { Broadcaster } from './broadcaster';

@Injectable()
export class UserService {

  private loginUrl = 'https://sarlacc.herokuapp.com/oauth/token';
  private logoutUrl = 'https://info-manager.herokuapp.com/auth/logout';

  private getUserUrl = 'https://sarlacc.herokuapp.com/user-details';
  //private logoutUrl = 'http://localhost:8090/auth/logout';

  private token: string;
  private loginHeaders: Headers;
  private response: Response;
  
  constructor(
    private http: Http,
    private cookieService: CookieService,
    private broadcaster: Broadcaster
  ){
    this.loginHeaders = new Headers({
      'Content-Type'   : 'application/x-www-form-urlencoded',
      'Authorization'  : 'Basic ' + btoa('sarlacc:deywannawanga')
    });
  }

  getAuthHeaders(): Headers {
    return new Headers({
      'Content-Type'   : 'application/json',
      'x-access-token'  : this.getToken()
    });
  }

  getLoginHeaders(username:string, password:string): Headers {
    return new Headers({
      'Authorization'  : 'Basic ' + btoa(username + ':' + password)
    });
  }

  getUserHeaders(token:string): Headers {
    return new Headers({
      'Authorization'  : 'Bearer ' + token
    });
  }

  login(creds: any): Promise<any> {
    console.log(creds);

    creds.grant_type = 'password';

    let body = `username=${creds.username}&password=${creds.password}&grant_type=${creds.grant_type}`;

    return this.http.post(this.loginUrl, body, {headers: this.loginHeaders})
    .toPromise()
    .then((res:any) => {
      console.log('LOGIN SUCCESS');
      console.log(res);
      var token = res.json();

      return this.http.post(this.getUserUrl, {}, {headers: this.getUserHeaders(token.access_token)})
      .toPromise()
      .then((res:any) => {
        console.log('GET USER SUCCESS');
        console.log(res);
        var user = res.json();
        this.cookieService.put('access-token',token.access_token);
        this.broadcaster.broadcast('Login','The user logged in');
        return user;
      }).catch((res:any) => {
        console.log('GET USER FAILURE');
        console.log(res);
      });


    }).catch((res:any) => {
      console.log('LOGIN FAILURE');
      console.log(res);
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

  getToken(): string {
    if (!this.token){
      this.token = this.cookieService.get('access-token');
    }
    if (!this.token){
      this.logout();
    }
    return this.token;
  }

}