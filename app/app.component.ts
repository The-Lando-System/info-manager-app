import { Component } from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'info-mgr-app',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.css' ],
  providers: []
})
export class AppComponent {

  welcome = '';



  ngOnInit(): void {
    this.welcome = 'Info Manager';
  }


}
