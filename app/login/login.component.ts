import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})
export class LoginComponent implements OnInit {
  loginLoading = false;
  creds = {};

  @ViewChild('loginModal')
  modal: ModalComponent;

  ngOnInit(): void {
  }

  login(): void {
    console.log('Login attempted');

    if (this.creds['username'] && this.creds['password']){

    }



    this.modal.close();
  }
}