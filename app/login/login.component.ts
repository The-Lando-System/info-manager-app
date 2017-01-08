import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { UserService } from 'sarlacc-js-client/dist/user.service';
import { User } from 'sarlacc-js-client/dist/user';

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

  private errorMessage = '';

  @ViewChild('loginModal')
  modal: ModalComponent;

  constructor(
    private userService: UserService
  ){}

  ngOnInit(): void {

    this.errorMessage = '';

    this.userService.checkIfUserIsLoggedIn()
    .then((res:any) => {
      this.user = this.userService.getUser();
    }).catch((error:string) => {
      
    })
  }

  login(): void {
    event.preventDefault();
    this.loginLoading = true;
    this.errorMessage = '';

    this.userService.login(this.creds)
    .then((user:any) => {
      this.user = user;
      this.loginLoading = false;
      this.modal.close();
      this.creds = {};
    }).catch((error:any) => {
      this.loginLoading = false;
      this.errorMessage = error;
    });
  }

  logout(): void {
    event.preventDefault();
    if (confirm('Are you sure you want to logout?')){
      this.userService.logout();
      this.user = null;
    }
  }
}