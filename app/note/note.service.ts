import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Note } from './note';
import { UserService } from '../services/user.service';
//import { UserService } from 'sarlacc-js-client/dist/user.service';

import { Globals } from '../globals';

@Injectable()
export class NoteService {

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}

  globals: Globals = new Globals();

  private notesUrl = this.globals.svc_domain + '/notes/';

  getNotes(): Promise<Note[]> {
    return this.http.get(this.notesUrl, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      var notes = res.json();
      return notes;
    }).catch((res:any) => {
    });
  }

  getNoteById(id:string): Promise<Note> {
    return this.http.get(this.notesUrl + id, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      var note = res.json();
      return note;
    }).catch((res:any) => {
    });
  }

}