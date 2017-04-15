import { Component, OnInit, Input } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Router } from '@angular/router';

import { UserService } from '../../sarlacc-client/user.service';
import { User } from '../../sarlacc-client/user';
import { Broadcaster } from '../../sarlacc-client/broadcaster';

import { FolderService } from '../../models/folder/folder.service';
import { Folder } from '../../models/folder/folder';

import { NoteService } from '../../models/note/note.service';
import { Note } from '../../models/note/note';

import { NoteOrderService } from '../../models/note-order/note-order.service';

import { PreferenceService } from '../../services/preference.service';

@Component({
  moduleId: module.id,
  selector: 'folders',
  templateUrl: 'folders.component.html',
  styleUrls: [ 'folders.component.css' ],
  providers: [
    FolderService,
    NoteService,
    NoteOrderService
  ]
})
export class FoldersComponent implements OnInit {

  @Input()
  folders: Folder[];

  user: User;
  newFolder: Folder = new Folder();

  private creatingFolder = false;

  private homeLoading = false;
  private newFolderLoading = false;
  private folderDeleteLoading = false;
  private idOfDeletingFolder:String = '';

  private folderEditLoading = false;
  private editedFolder:Folder = new Folder();
  private editedFoldersOriginalName = "";
  private idOfEditingFolder:String = '';

  constructor(
    private folderSvc: FolderService,
    private noteSvc: NoteService,
    private userSvc: UserService,
    private broadcaster: Broadcaster,
    private cookieSvc: CookieService,
    private router: Router,
    private preferenceSvc: PreferenceService,
    private noteOrderSvc: NoteOrderService
  ){}

  ngOnInit(): void {
    this.homeLoading = true;
    this.userSvc.returnUser()
    .then((user:User) => {
      this.user = user;
      this.getFolders();
    }).catch((res:any) => {
      console.log('Not getting folders... User is not logged in');
      this.homeLoading = false;
    });

    this.listenForLogin();
    this.listenForLogout();
  }

  listenForLogin(): void {
   this.broadcaster.on<string>(this.userSvc.LOGIN_BCAST)
    .subscribe(message => {

      this.homeLoading = true;

      this.userSvc.returnUser()
      .then((user:User) => {
        

        this.preferenceSvc.getPrimaryFolderId()
        .then((primaryFolderId:string) => {
          if (primaryFolderId) {
            let path = '/folder/' + primaryFolderId;
            this.router.navigate([path]);
            this.homeLoading = false;
          } else {
            this.getFolders();
            this.user = user;
            this.homeLoading = false;
          }
        }).catch((res:any) => {
          this.getFolders();
          this.user = user;
          this.homeLoading = false;
        });

      }).catch((res:any) => {
        console.log('Not getting folders... User is not logged in');
        this.homeLoading = false;
      });
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

      for (let folder of this.folders) {
        folder.notes = [];

        this.noteSvc.getNotesInFolder(folder.id)
        .then((notes:Note[]) => {
          folder.notes = notes;

          this.noteOrderSvc.orderNotes(folder.notes, folder.id)
          .then((sortedNotes:Note[]) => {
            console.log("Successfully sorted notes");

            folder.notes.splice(3,folder.notes.length-3);

            this.homeLoading = false;

          }).catch((unsortedNotes:Note[]) => {
            console.log("Failed to sort notes");

            folder.notes.splice(3,folder.notes.length-3);

            this.homeLoading = false;
          });
          
          
        }).catch((res:any) => {
          this.homeLoading = false;
        });
        
      }

    }).catch((res:any) => {
      this.homeLoading = false;
    });

  }

  createFolder(): void {
    event.preventDefault();
    this.newFolderLoading = true;
    this.folderSvc.createFolder(this.newFolder)
    .then((folder:any) => {
      let newFolder: Folder = folder;
      newFolder.notes = [];
      newFolder.noteIds = [];
      this.folders.push(newFolder);
      this.newFolder = new Folder();
      this.newFolderLoading = false;
    }).catch((error:any) => {
      this.newFolderLoading = false;
    });

  }

  deleteFolder(folderId:String): void {
    event.preventDefault();
    this.idOfDeletingFolder = folderId;
    this.folderDeleteLoading = true;
    this.folderSvc.deleteFolderById(folderId)
    .then((res:any) => {
      for(var i=0; i<this.folders.length; i++){
        if (this.folders[i].id === folderId){
          this.folders.splice(i,1);
        }
      }
      this.folderDeleteLoading = false;
    }).catch((error:any) => {
      this.folderDeleteLoading = false;
    });
  }

  beginEdit(folderToEdit:Folder): void {
    event.preventDefault();
    this.editedFolder = Object.assign({},folderToEdit);
  }

  stopEdit(): void {
    event.preventDefault();
    this.editedFolder = new Folder();
  }

  editFolderName(): void {
    event.preventDefault();
    this.folderEditLoading = true;
    this.idOfEditingFolder = this.editedFolder.id;
    this.folderSvc.editFolder(this.editedFolder)
    .then((folder:Folder) => {
      for(var i=0; i<this.folders.length; i++){
        if (this.folders[i].id === folder.id){
          this.folders[i].name = folder.name;
        }
      }
      this.stopEdit();
      this.folderEditLoading = false;
      this.idOfEditingFolder = "";
    }).catch((error:any) => {
      this.stopEdit();
      this.folderEditLoading = false;
      this.idOfEditingFolder = "";
    });
  }

}