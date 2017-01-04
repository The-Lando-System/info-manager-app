import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Note } from './note';
import { UserService } from '../services/user.service';

@Injectable()
export class NoteService {

  private notesUrl = 'https://info-manager.herokuapp.com/notes/';

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}


  getNotes(): Promise<Note[]> {
    return this.http.get(this.notesUrl, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      console.log('GET NOTES SUCCESS');
      console.log(res);
      var notes = res.json();
      return notes;
    }).catch((res:any) => {
      console.log('GET NOTES FAILURE');
      console.log(res);
    });
  }

  getNoteById(id:string): Promise<Note> {
    return this.http.get(this.notesUrl + id, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      console.log('GET NOTE SUCCESS');
      console.log(res);
      var note = res.json();
      return note;
    }).catch((res:any) => {
      console.log('GET NOTE FAILURE');
      console.log(res);
    });
  }

}