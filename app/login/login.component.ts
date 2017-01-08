import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { UserService } from '../services/user.service';
//import { UserService } from 'sarlacc-js-client/dist/user.service';
import { User } from '../services/user';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})
export class LoginComponent implements OnInit {
  loginLoading = false;
  creds = {};
  user: User;

  @ViewChild('loginModal')
  modal: ModalComponent;

  constructor(
    private userService: UserService
  ){}

  ngOnInit(): void {

    this.userService.checkIfUserIsLoggedIn()
    .then((res:any) => {
      this.user = this.userService.getUser();
    }).catch((error:any) => {
      console.log("Login Component - User not logged in");
    })
  }

  login(): void {
    console.log('Login attempted');
    event.preventDefault();
    this.loginLoading = true;

    this.userService.login(this.creds)
    .then((user:any) => {
      console.log(user);
      this.user = user;
      this.loginLoading = false;
      this.modal.close();
    }).catch((res:any) => {
      this.loginLoading = false;
    });

    
  }
}