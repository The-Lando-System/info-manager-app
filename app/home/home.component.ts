import { Component, OnInit, Input } from '@angular/core';

import { FolderService } from '../folder/folder.service';
import { Folder } from '../folder/folder';

import { NoteService } from '../note/note.service';
import { Note } from '../note/note';

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.css' ],
  providers: [
    FolderService,
    NoteService
  ]
})
export class HomeComponent implements OnInit {

  @Input()
  folders: Folder[];

  constructor(
    private folderSvc: FolderService,
    private noteSvc: NoteService
  ){}

  ngOnInit(): void {
    this.getFolders();
  }

  getFolders(): void {
    console.log('Attempting to get folders');
    event.preventDefault();

    this.folderSvc.getFolders()
    .then((folders:any) => {
      console.log(folders);
      this.folders = folders;

      for (let folder of this.folders) {
        folder.notes = [];

        for (let noteId of folder.noteIds) {

          this.noteSvc.getNoteById(noteId)
          .then((note:any) => {
            console.log(note);
            folder.notes.push(note);
          }).catch((res:any) => {

          });

        }

        // var note: Note = new Note();
        // note.title = "Note 1";
        // note.details = "Note 1 Details";
        // folder.notes.push(note);
      }

      // for (var i=0; i<this.folders.length; i++){

      //   var note: Note = new Note();
      //   note.title = "Note 1";
      //   note.details = "Note 1 Details";

      //   this.folders[i].notes.push(note);
        // for (var j=0; j<this.folders[i].noteIds.length; j++){
        
        // }
      //}

    }).catch((res:any) => {

    });

  }

}