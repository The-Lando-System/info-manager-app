import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import 'hammerjs/hammer.js';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Logger } from 'angular2-logger/core';
import { UserService, Broadcaster } from 'sarlacc-angular-client';

import { PreferenceService } from './services/preference.service';

import { AppComponent }  from './app.component';
import { FoldersComponent } from './views/folders/folders.component';
import { NavbarComponent } from './views/navbar/navbar.component';
import { LoginComponent } from './views/login/login.component';
import { FolderNotesComponent } from './views/folder-notes/folder-notes.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/folders',
        pathMatch: 'full'
      },
      {
        path: 'folders',
        component: FoldersComponent
      },
      {
        path: 'folder/:id',
        component: FolderNotesComponent
      }
    ])
  ],
  declarations: [
    AppComponent,
    FoldersComponent,
    NavbarComponent,
    LoginComponent,
    FolderNotesComponent
  ],
  providers: [
    Logger,
    CookieService,
    Broadcaster,
    UserService,
    PreferenceService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
