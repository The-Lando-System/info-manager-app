import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UserService } from 'sarlacc-angular-client';

import { Globals } from '../../globals';

import { NoteOrder } from './note-order';
import { Note } from '../note/note';

@Injectable()
export class NoteOrderService {

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}

  globals: Globals = new Globals();

  private foldersUrl = this.globals.svc_domain + '/folders/';

  getNoteOrder(folderId:string): Promise<NoteOrder> {
    return this.http.get(this.foldersUrl + folderId + '/note-order', {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      var noteOrder = res.json();
      return noteOrder;
    }).catch((res:any) => {
        console.log("Failed to get note order for folder id: " + folderId);
    });
  }

  setNoteOrder(folderId:string,notes:Note[]): Promise<NoteOrder> {

    let noteOrder = new NoteOrder();
    noteOrder.folderId = folderId;
    noteOrder.noteOrder = {};
    for(var i=0; i<notes.length; i++){
        noteOrder.noteOrder[notes[i].id] = i+1;
    }

    return this.http.post(this.foldersUrl + '/note-order', noteOrder, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      var noteOrder = res.json();
      return noteOrder;
    }).catch((res:any) => {
        console.log("Failed to set note order for folder id: " + folderId);
    });
  }

  orderNotes(notes:Note[], folderId:string): Promise<Note[]> {
    return this.getNoteOrder(folderId)
    .then((noteOrder:NoteOrder) => {
        return notes.sort(function(noteA,noteB) {
            return noteOrder.noteOrder[noteA.id] - noteOrder.noteOrder[noteB.id];
        });
    }).catch((res:any) => {
        return notes;
    });
  }

}