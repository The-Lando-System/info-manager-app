import { Component, Input } from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'info-mgr-app',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.css' ],
  providers: []
})
export class AppComponent {

  welcome = '';

  constructor(
  ){}

  ngOnInit(): void {
    this.welcome = 'Info Manager';
  }


}