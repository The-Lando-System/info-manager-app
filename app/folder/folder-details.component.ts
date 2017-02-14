import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UserService } from 'sarlacc-js-client/dist/user.service';
import { User } from 'sarlacc-js-client/dist/user';
import { Broadcaster } from 'sarlacc-js-client/dist/broadcaster';

import { FolderService } from '../folder/folder.service';
import { Folder } from '../folder/folder';

import { NoteService } from '../note/note.service';
import { Note } from '../note/note';

@Component({
  moduleId: module.id,
  selector: 'folder-details',
  templateUrl: 'folder-details.component.html',
  styleUrls: [ 'folder-details.component.css' ],
  providers: [
    FolderService,
    NoteService
  ]
})
export class FolderDetailsComponent implements OnInit {

  folder:Folder;
  newNote:Note = new Note();

  constructor(
    private folderSvc: FolderService,
    private noteSvc: NoteService,
    private userSvc: UserService,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let id = params['id'];
      if (id){
        this.getFolderAndNotes(id);
      }
    });
  }

  getFolderAndNotes(folderId:String): void {
    this.folderSvc.getFolderById(folderId)
    .then((folder:any) => {
      this.folder = folder;
      this.folder.notes = [];

      for (let noteId of this.folder.noteIds) {

        this.noteSvc.getNoteById(noteId)
        .then((note:any) => {
          this.folder.notes.push(note);
        }).catch((res:any) => {});

      }
    }).catch((res:any) => {});
  }
  
  createNewNote(): void {

    this.noteSvc.createNoteInFolder(this.newNote, this.folder.id)
    .then((note:Note) => {
      this.folder.noteIds.push(note.id);
      this.folder.notes.push(note);
      this.newNote = new Note();
    }).catch((res:any) => {});
  }

  deleteNote(note:Note): void {
    event.preventDefault();

    this.noteSvc.deleteNoteFromFolder(note, this.folder.id)
    .then((res:any) => {
      for(var i=0; i<this.folder.noteIds.length; i++){
        if (this.folder.noteIds[i] === note.id){
          this.folder.noteIds.splice(i,1);
        }
      }

      for(var i=0; i<this.folder.notes.length; i++){
        if (this.folder.notes[i].id === note.id){
          this.folder.notes.splice(i,1);
        }
      }


    }).catch((res:any) => {})
  }

}