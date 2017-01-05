import { Component, OnInit, Input } from '@angular/core';

import { FolderService } from '../folder/folder.service';
import { Folder } from '../folder/folder';

import { NoteService } from '../note/note.service';
import { Note } from '../note/note';

import { UserService } from '../services/user.service';
import { User } from '../services/user';

import { Broadcaster } from '../services/broadcaster';

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
    private noteSvc: NoteService,
    private userSvc: UserService,
    private broadcaster: Broadcaster
  ){}

  ngOnInit(): void {

    this.userSvc.checkIfUserIsLoggedIn()
    .then((res:any) => {
      this.getFolders();
    }).catch((res:any) => {
      console.log('Not getting folders... User is not logged in');
    });

    this.listenForLogin();
  }

  listenForLogin(): void {
   this.broadcaster.on<string>('Login')
    .subscribe(message => {
      this.getFolders();
    });
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
        
      }

    }).catch((res:any) => {

    });

  }

}