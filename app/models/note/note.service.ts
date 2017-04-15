import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UserService } from '../../sarlacc-client/user.service';

import { Globals } from '../../globals';

import { Note } from './note';

@Injectable()
export class NoteService {

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}

  globals: Globals = new Globals();

  private notesUrl = this.globals.svc_domain + '/notes/';
  private foldersUrl = this.globals.svc_domain + '/folders/';

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

  createNoteInFolder(newNote:Note, folderId:String): Promise<Note> {
    return this.http.post(this.notesUrl + folderId, newNote, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      var note = res.json();
      return note;
    }).catch((res:any) => {
      console.log('Failed to create new note');
    });
  }

  deleteNoteFromFolder(noteToDelete:Note, folderId:String): Promise<void> {

    return this.http.delete(this.notesUrl + noteToDelete.id + '/' + folderId, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      
    }).catch((res:any) => {
      console.log('Failed to delete note from folder');
    });
  }

  editNote(noteToEdit:Note): Promise<Note> {

    return this.http.put(this.notesUrl, noteToEdit, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((res:any) => {
      console.log("Failed to edit note");
    });

  }

  getNotesInFolder(folderId:String): Promise<Note[]> {
    return this.http.get(this.foldersUrl + '/' + folderId + '/notes', {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((res:any) => {
      console.log("Failed to return notes for folder id " + folderId);
    })
}

}