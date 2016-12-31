import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { UserService } from '../services/user.service';

@Injectable()
export class FolderService {

  private foldersUrl = 'http://localhost:8090/folders/';

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}


  getFolders(): Promise<Folder[]> {
    return this.http.get(this.foldersUrl, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      console.log('GET FOLDERS SUCCESS');
      console.log(res);
      var folders = res.json();
      return folders;
    }).catch((res:any) => {
      console.log('GET FOLDERS FAILURE');
      console.log(res);
    });
  }

}