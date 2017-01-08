import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Logger } from "angular2-logger/core";

import { Broadcaster } from './broadcaster';
import { User } from './user';
import { Token } from './token';

@Injectable()
export class UserService {

  private TAG = 'UserService - ';

  private tokenUrl = 'https://sarlacc.herokuapp.com/oauth/token';
  private userUrl = 'https://sarlacc.herokuapp.com/user-details';

  private token: Token;
  private user: User;

  private initPromise: Promise<any> = this.initialize();
  
  constructor(
    private logger: Logger,
    private http: Http,
    private cookieService: CookieService,
    private broadcaster: Broadcaster
  ){}

  // Initialization ================================================

  private initialize(): Promise<any> {

    this.logger.info(this.TAG + 'Initializing the user service');

    return new Promise((resolve, reject) => {

      this.token = this.getTokenFromCookie();

      if (this.token) {
        this.logger.debug(this.TAG + 'Attempting to get user details with the access token');
        this.retrieveUser(this.token)
        .then((user:User) => {
          this.logger.info(this.TAG + 'Intialization completed... User and token are both set');
          this.user = user;
          resolve();
        }).catch((error:any) => {
          this.logout();
          this.logger.info(this.TAG + 'Initialization complete. No user logged in');
          reject();
        });
      } else {
        this.logger.info(this.TAG + 'Initialization complete. No user logged in');
        reject();
      }
    });
  }

  // Public Methods ================================================

  checkIfUserIsLoggedIn(): Promise<any> {
    return this.initPromise;
  }

  login(creds: any): Promise<User> {
    this.logger.info(this.TAG + 'User logging in with username ' + creds.username);
    this.logger.debug(this.TAG + 'Attempting to obtain an access token');

    return new Promise((resolve, reject) => {

      this.retrieveToken(creds)
      .then((token:Token) => {

        this.putTokenInCookie(token);
        this.token = token;

        this.logger.debug(this.TAG + 'Attempting to get user details with the access token');
        this.retrieveUser(token)
        .then((user:User) => {
          this.logger.info(this.TAG + 'Login successful');
          this.user = user;
          this.broadcaster.broadcast('Login','The user logged in');
          resolve(user);
        }).catch((error:any) => {
          this.logger.info(this.TAG + 'Login failed');
          this.logout();
          reject(error);
        });
      }).catch((error:any) => {
        this.logger.info(this.TAG + 'Login failed');
        this.logout();
        reject(error);
      });

    });
  }

  logout(): void {
    this.logger.info(this.TAG + 'Logging the user out');
    this.removeTokenFromCookie();
    this.token = null;
    this.user = null;
    this.broadcaster.broadcast('Logout','The user is logged out');
  }

  getUser(): User {
    return this.user;
  }

  getToken(): Token {
    return this.token;
  }

  getAuthHeaders(): Headers {
    return new Headers({
      'Content-Type'   : 'application/json',
      'x-access-token'  : this.getToken().access_token
    });
  }

  
  // Private Methods ================================================

  private retrieveUser(token:Token): Promise<User> {
    return new Promise((resolve, reject) => {
      this.http.post(this.userUrl, {}, {headers: this.getUserHeaders(token.access_token)})
        .toPromise()
        .then((res:any) => {
          var user = res.json();
          this.logger.debug(this.TAG + 'Successfully got a user with username: ' + user.username);
          this.logger.debug(this.TAG + 'Full user details: ' + JSON.stringify(user));
          resolve(user);
        }).catch((res:any) => {
          var error = res.json();
          this.logger.warn(this.TAG + 'Failed to retrieve a user with access token: ' + token.access_token);
          this.logger.debug(this.TAG + 'Error from the server: ' + JSON.stringify(error));
          reject(this.resolveError(error));
        });
    });
  }

  private retrieveToken(creds:any): Promise<Token> {

    creds.grant_type = 'password';
    let body = `username=${creds.username}&password=${creds.password}&grant_type=${creds.grant_type}`;

    return new Promise((resolve, reject) => {
      this.http.post(this.tokenUrl, body, {headers: this.getTokenHeaders()})
      .toPromise()
      .then((res:any) => {
        var token = res.json();
        this.logger.debug(this.TAG + 'Successfully retrieved an access token: ' + token.access_token);
        this.logger.debug(this.TAG + 'Full token details: ' + JSON.stringify(token));
        resolve(token);
      }).catch((res:any) => {
        var error = res.json();
        this.logger.warn(this.TAG + 'Failed to retrieve an access token');
        this.logger.debug(this.TAG + 'Error from the server: ' + JSON.stringify(error));
        reject(this.resolveError(error));
      });
    });
  }

  private resolveError(error:any): string {
    var message = 'Unknown error occurred';
    if (error.status === 404){
      message = 'Failed to connect to the Sarlacc';
    }
    if (error.error === 'invalid_token') {
      message = 'Invalid or bad token provided';
    }
    if (error.error === 'invalid_grant' || error.error === 'unauthorized'){
      message = 'Incorrect username or password';
    }
    this.logger.debug(this.TAG + 'Resolved error: ' + message);
    return message;
  }

  private putTokenInCookie(token:Token): void {
    this.logger.debug(this.TAG + 'Putting the following value in the access-token cookie: ' + token.access_token);
    this.cookieService.put('access-token',token.access_token);
  }

  private getTokenFromCookie(): Token {
    this.logger.debug(this.TAG + 'Checking if the browser has the access-token cookie');
    var access_token = this.cookieService.get('access-token');
    if (access_token) {
      this.logger.debug(this.TAG + 'Found the following value in the access-token cookie: ' + access_token);
      var token: Token = new Token();
      token.access_token = access_token;
      return token;
    } else {
      this.logger.debug(this.TAG + 'No access-token cookie found');
      return null;
    }
  }

  private removeTokenFromCookie(): void {
    this.logger.debug(this.TAG + 'Removing the access-token cookie');
    this.cookieService.remove('access-token');
  }

  private getTokenHeaders(): Headers {
    return new Headers({
      'Content-Type'   : 'application/x-www-form-urlencoded',
      'Authorization'  : 'Basic ' + btoa('sarlacc:deywannawanga')
    });
  }

  private getUserHeaders(token:string): Headers {
    return new Headers({
      'Authorization'  : 'Bearer ' + token
    });
  }

}