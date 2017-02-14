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

  user: User;
  newFolder: Folder = new Folder();

  private creatingFolder = false;

  private homeLoading = false;

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
      this.user = this.userSvc.getUser();
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
      this.user = this.userSvc.getUser();
    });
  }

  listenForLogout(): void {
    this.broadcaster.on<string>(this.userSvc.LOGOUT_BCAST)
    .subscribe(message => {
      this.folders = null;
      this.user = null;
    });
  }

  getFolders(): void {
    event.preventDefault();

    this.homeLoading = true;

    this.folderSvc.getFolders()
    .then((folders:any) => {
      this.folders = folders;

      this.homeLoading = false;

      for (let folder of this.folders) {
        folder.notes = [];

        var displayedNotes = 0;

        for (let noteId of folder.noteIds) {

          if (displayedNotes < 3){
            displayedNotes++;
            this.noteSvc.getNoteById(noteId)
            .then((note:any) => {
              folder.notes.push(note);
            }).catch((res:any) => {

            });
          }
        }
        
      }

    }).catch((res:any) => {
      this.homeLoading = false;
    });

  }

  createFolder(): void {
    event.preventDefault();

    this.folderSvc.createFolder(this.newFolder)
    .then((folder:any) => {
      let newFolder: Folder = folder;
      newFolder.notes = [];
      newFolder.noteIds = [];
      this.folders.push(newFolder);
      this.newFolder = new Folder();
    }).catch((error:any) => {

    });

  }

  deleteFolder(folderId:String): void {
    event.preventDefault();

    this.folderSvc.deleteFolderById(folderId)
    .then((res:any) => {
      for(var i=0; i<this.folders.length; i++){
        if (this.folders[i].id === folderId){
          this.folders.splice(i,1);
        }
      }
    }).catch((error:any) => {

    });
  }

}