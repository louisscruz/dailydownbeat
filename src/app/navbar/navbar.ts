import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, Router, Location} from 'angular2/router';
import {HTTP_PROVIDERS, Http, ConnectionBackend} from 'angular2/http';
//import {Collapse, DROPDOWN_DIRECTIVES, ButtonCheckbox} from 'ng2-bootstrap/ng2-bootstrap';

import {AuthService} from '../services/auth/authService';
import {AlertService} from '../services/alerts/alertsService';

import {RouterActive} from '../directives/router-active';

@Component({
  selector: 'navbar',
  directives: [ ROUTER_DIRECTIVES, RouterActive ],
  //directives: [ROUTER_DIRECTIVES, Collapse, DROPDOWN_DIRECTIVES, ButtonCheckbox, RouterActive],
  styles: [ require('../global-variables.scss'), require('./navbar.scss') ],
  template: require('./navbar.html'),
  providers: [Http, ConnectionBackend, HTTP_PROVIDERS]
})
export class Navbar {
  private isCollapsed: boolean = true;

  constructor(
    private _http: Http,
    private _router: Router,
    private _authService: AuthService,
    private _location: Location
  ) {}
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  collapse() {
    this.isCollapsed = true;
  }
  logout() {
    this._authService.logout()
    .subscribe(
      data => console.log(data),
      err => console.log(err),
      () => {
        this._authService.deleteJwt();
        this._router.navigate(['Home']);
      }
    );
  }
  addPost() {
    if (this._authService.currentUser) {
      this._router.navigate(['AddPost']);
    } else {
      this._router.navigate(['Login']);
    }
  }
}
