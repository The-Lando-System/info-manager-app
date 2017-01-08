import { Component, OnInit, Input } from '@angular/core';

import { UserService } from 'sarlacc-js-client/dist/user.service';
import { User } from 'sarlacc-js-client/dist/user';
import { Broadcaster } from 'sarlacc-js-client/dist/broadcaster';

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
    this.listenForLogout();
  }

  listenForLogin(): void {
   this.broadcaster.on<string>(this.userSvc.LOGIN_BCAST)
    .subscribe(message => {
      this.getFolders();
    });
  }

  listenForLogout(): void {
    this.broadcaster.on<string>(this.userSvc.LOGOUT_BCAST)
    .subscribe(message => {
      this.folders = null;
    });
  }

  getFolders(): void {
    event.preventDefault();

    this.folderSvc.getFolders()
    .then((folders:any) => {
      this.folders = folders;

      for (let folder of this.folders) {
        folder.notes = [];

        for (let noteId of folder.noteIds) {

          this.noteSvc.getNoteById(noteId)
          .then((note:any) => {
            folder.notes.push(note);
          }).catch((res:any) => {

          });

        }
        
      }

    }).catch((res:any) => {

    });

  }

}