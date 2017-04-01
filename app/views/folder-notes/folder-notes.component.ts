import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { UserService } from '../../sarlacc-client/user.service';
import { User } from '../../sarlacc-client/user';
import { Broadcaster } from '../../sarlacc-client/broadcaster';

import { FolderService } from '../../models/folder/folder.service';
import { Folder } from '../../models/folder/folder';

import { NoteService } from '../../models/note/note.service';
import { Note } from '../../models/note/note';

@Component({
  moduleId: module.id,
  selector: 'folder-notes',
  templateUrl: 'folder-notes.component.html',
  styleUrls: [ 'folder-notes.component.css' ],
  providers: [
    FolderService,
    NoteService
  ]
})
export class FolderNotesComponent implements OnInit {

  folder:Folder;
  newNote:Note = new Note();
  editedNote:Note = new Note();
  previousNote:Note = new Note();

  private noteLoading = false;

  constructor(
    private folderSvc: FolderService,
    private noteSvc: NoteService,
    private userSvc: UserService,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private router: Router
  ){}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let id = params['id'];
      if (id){
        this.getFolderAndNotes(id);
      }
    });
    this.listenForLogout();
  }

  listenForLogout(): void {
    this.broadcaster.on<string>(this.userSvc.LOGOUT_BCAST)
    .subscribe(message => {
      this.router.navigate(['/folders']);
    });
  }

  getFolderAndNotes(folderId:String): void {
    this.noteLoading = true;
    this.folderSvc.getFolderById(folderId)
    .then((folder:any) => {
      this.folder = folder;
      this.folder.notes = [];
      this.noteLoading = false;
      for (let noteId of this.folder.noteIds) {

        this.noteSvc.getNoteById(noteId)
        .then((note:any) => {
          this.folder.notes.push(note);
        }).catch((res:any) => {

        });

      }
    }).catch((res:any) => {
      this.noteLoading = false;
    });
  }
  
  createNewNote(): void {
    this.noteLoading = true;
    this.noteSvc.createNoteInFolder(this.newNote, this.folder.id)
    .then((note:Note) => {
      this.folder.noteIds.push(note.id);
      this.folder.notes.push(note);
      this.newNote = new Note();
      this.noteLoading = false;
    }).catch((res:any) => {
      this.noteLoading = false;
    });
  }

  deleteNote(note:Note): void {
    event.preventDefault();
    this.noteLoading = true;
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
      this.noteLoading = false;

    }).catch((res:any) => {
      this.noteLoading = false;
    })
  }

  beginEdit(note:Note){
    event.preventDefault();
    this.editedNote.id = note.id;
    this.editedNote.title = note.title;
    this.editedNote.details = note.details;
  }

  stopEdit(){
    event.preventDefault();
    this.editedNote = new Note();
  }

  editNote(){
    event.preventDefault();
    this.noteLoading = true;
    if (this.editedNote.details && this.editedNote.title) {
      this.noteSvc.editNote(this.editedNote)
      .then((res:Note) => {

        for(var i=0; i<this.folder.notes.length; i++){
          if (this.folder.notes[i].id === this.editedNote.id){
            this.folder.notes[i].title = this.editedNote.title;
            this.folder.notes[i].details = this.editedNote.details;
          }
        }

        this.editedNote = new Note();
        this.noteLoading = false;
      }).catch((res:any) => {
        this.noteLoading = false;
      });
    }
  }

}