import { Component, OnInit } from '@angular/core';

import { FolderService } from '../folder/folder.service';

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.css' ],
  providers: [
    FolderService
  ]
})
export class HomeComponent implements OnInit {
  title = 'Secure way to manage your information';

  constructor(
    private folderSvc: FolderService
  ){}

  ngOnInit(): void {
  }

  getFolders(): void {
    console.log('Attempting to get folders');
    event.preventDefault();

    this.folderSvc.getFolders()
    .then((folders:any) => {
      console.log(folders);
    }).catch((res:any) => {

    });

  }

}