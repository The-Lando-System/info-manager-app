import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { UserService } from '../services/user.service';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ],
  providers: [
    UserService
  ]
})
export class LoginComponent implements OnInit {
  loginLoading = false;
  creds = {};
  user = {};

  @ViewChild('loginModal')
  modal: ModalComponent;

  constructor(
    private userService: UserService
  ){}

  ngOnInit(): void {
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
    }).catch((res:any) => {
      this.loginLoading = false;
    });

    this.modal.close();
  }
}