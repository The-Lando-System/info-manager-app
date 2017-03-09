import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { UserService } from '../sarlacc-client/user.service';

import { Globals } from '../globals';

import { Folder } from './folder';

@Injectable()
export class FolderService {

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}

  globals: Globals = new Globals();

  private notesUrl = this.globals.svc_domain + '/notes/';
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

  getFolderById(folderId:String): Promise<Folder> {
    return this.http.get(this.foldersUrl + '/' + folderId, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((res:any) => {
      console.log('Encountered error getting folder with ID ' + folderId);
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

  deleteFolderById(folderId:String): Promise<void> {
    return this.http.delete(this.foldersUrl + '/' + folderId, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {

    }).catch((res:any) => {
      console.log('Encountered error deleting folder with ID ' + folderId);
    });
  }

  editFolder(folderToEdit:Folder): Promise<Folder> {
    return this.http.put(this.foldersUrl, folderToEdit, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((res:any) => {
      console.log('Encounterd error editing folder with ID ' + folderToEdit.id);
    })
  }

}