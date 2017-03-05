import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import 'hammerjs/hammer.js';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Logger } from "angular2-logger/core";

import { Broadcaster } from './sarlacc-client/broadcaster';
import { UserService } from './sarlacc-client/user.service';
import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { FolderDetailsComponent } from './folder/folder-details.component';

@NgModule({
  imports: [ 
  	BrowserModule,
  	FormsModule,
  	HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'folder/:id',
        component: FolderDetailsComponent
      }
    ])
  ],
  declarations: [ 
  	AppComponent,
  	HomeComponent,
    NavbarComponent,
    LoginComponent,
    FolderDetailsComponent
  ],
  providers: [
    Logger,
    CookieService,
    Broadcaster,
    UserService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }