import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Folder } from './folder';
import { UserService } from '../services/user.service';

@Injectable()
export class FolderService {

  //private foldersUrl = 'http://localhost:8090/folders/';
  private foldersUrl = 'https://info-manager.herokuapp.com/folders/';

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}


  getFolders(): Promise<Folder[]> {
    return this.http.get(this.foldersUrl, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((res:any) => {
      console.log('Folder Svc - Error getting folders:');
      console.log(res);
    });
  }

}