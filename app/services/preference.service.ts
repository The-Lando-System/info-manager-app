import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { UserService } from '../sarlacc-client/user.service';

import { Globals } from '../globals';

@Injectable()
export class PreferenceService {

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}

  globals: Globals = new Globals();

  private preferencesUrl = this.globals.svc_domain + '/preferences/';
  private foldersUrl = this.globals.svc_domain + '/folders/';

  getPrimaryFolderId(): Promise<string> {
    return this.http.get(this.preferencesUrl, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      let preferences = res.json();
      return preferences.primaryFolderId;
    }).catch((res:any) => {
      console.log('Encountered error getting primary folder');
    });
  }

  savePrimaryFolder(folderId:string): Promise<void> {
    return this.http.post(this.foldersUrl + '/make-primary/' + folderId, {}, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res;
    }).catch((res:any) => {
      console.log('Encountered error making primary folder with id ' + folderId);
    });
  }


}