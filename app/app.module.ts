import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import 'hammerjs/hammer.js';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';

import { Broadcaster } from './services/broadcaster';
import { UserService } from './services/user.service';


@NgModule({
  imports: [ 
  	BrowserModule,
  	FormsModule,
  	HttpModule,
    Ng2Bs3ModalModule,
    NgbModule.forRoot(),
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
      }
    ])
  ],
  declarations: [ 
  	AppComponent,
  	HomeComponent,
    NavbarComponent,
    LoginComponent
  ],
  providers: [
    CookieService,
    Broadcaster,
    UserService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }