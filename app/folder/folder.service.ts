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
      console.log('Encountered error getting folders');
    });
  }

  createFolder(newFolder:Folder): Promise<Folder> {
    return this.http.post(this.foldersUrl, newFolder, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((res:any) => {
      console.log('Encountered error creating a folder');
    });
  }

  getFolderById(folderId:String): Promise<Folder> {
    return this.http.get(this.foldersUrl + '/' + folderId, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((res:any) => {
      console.log('Encountered error getting folder with ID ' + folderId);
    });
  }

}