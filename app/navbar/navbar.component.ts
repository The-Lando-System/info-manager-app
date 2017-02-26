import { Component, OnInit } from '@angular/core';

import { UserService } from 'sarlacc-js-client/dist/user.service';
import { User } from 'sarlacc-js-client/dist/user';

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: [ 'navbar.component.css' ]
})
export class NavbarComponent implements OnInit {

  user: User;


  welcome = 'Info Manager';

  constructor(
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.userService.checkIfUserIsLoggedIn()
    .then((res:any) => {
      this.user = this.userService.getUser();
    }).catch((error:string) => {})
  }

  logout(): void {
    event.preventDefault();
    if (confirm('Are you sure you want to logout?')){
      this.userService.logout();
      this.user = null;
    }
  }
}