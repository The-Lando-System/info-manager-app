import { Component, OnInit } from '@angular/core';
import { Broadcaster } from '../sarlacc-client/broadcaster';
import { UserService } from '../sarlacc-client/user.service';
import { User } from '../sarlacc-client/user';

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: [ 'navbar.component.css' ]
})
export class NavbarComponent implements OnInit {

  user: User;
  welcome = 'Info Manager';
  baseSarlaccUrl = 'http://sarlacc.mattvoget.com/token/';
  sarlaccUrl = '';

  constructor(
    private userService: UserService,
    private broadcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.userService.returnUser()
    .then((user:User) => {
      this.user = user;
      this.sarlaccUrl = this.baseSarlaccUrl + this.userService.getToken().access_token;
    }).catch((error:string) => {});

    this.listenForLogin();
  }

  logout(): void {
    event.preventDefault();
    if (confirm('Are you sure you want to logout?')){
      this.userService.logout();
      this.user = null;
    }
  }

  listenForLogin(): void {
   this.broadcaster.on<string>(this.userService.LOGIN_BCAST)
    .subscribe(message => {
      this.userService.returnUser()
      .then((user:User) => {
        this.user = user;
        this.sarlaccUrl = this.baseSarlaccUrl + this.userService.getToken().access_token;
      }).catch((error:string) => {});
    });
  }
}