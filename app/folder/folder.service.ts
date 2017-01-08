import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { UserService } from 'sarlacc-js-client/dist/user.service';

import { Globals } from '../globals';

import { Folder } from './folder';

@Injectable()
export class FolderService {

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}

  globals: Globals = new Globals();

  private foldersUrl = this.globals.svc_domain + '/folders/';

  getFolders(): Promise<Folder[]> {
    return this.http.get(this.foldersUrl, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((res:any) => {
    });
  }

}