import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, Router} from 'angular2/router';
import {HTTP_PROVIDERS, Http, ConnectionBackend} from 'angular2/http';
import {Collapse} from 'ng2-bootstrap/ng2-bootstrap';

import {AuthService} from '../services/auth/authService';
import {AlertService} from '../services/alerts/alertsService';

@Component({
  selector: 'navbar',
  directives: [ROUTER_DIRECTIVES, Collapse],
  styles: [ require('../global-variables.scss'), require('./navbar.scss') ],
  template: require('./navbar.html'),
  providers: [Http, ConnectionBackend, HTTP_PROVIDERS, AuthService]
})
export class Navbar {
  private isCollapsed: boolean = true;
  private toggleCollapse: any;
  private collapse: any;
  private logout: any;
  constructor(
    private _http: Http,
    private _router: Router,
    private _authService: AuthService) {

    this.toggleCollapse = function() {
      this.isCollapsed = !this.isCollapsed;
    };
    this.collapse = function() {
      this.isCollapsed = true;
    };
    this.logout = function() {
      _authService.logout()
      .subscribe(
        data => console.log(data),
        err => console.log(err),
        () => {
          this._authService.deleteJwt();
          this._authService.isAuth();
          this._router.navigate(['Home']);
        }
      );
    };
  }
  isLoggedIn() {
    return this._authService.isAuth();
  }
  username() {
    return this._authService.username;
  }
  addPost() {
    if (this.isLoggedIn()) {
      this._router.navigate(['AddPost']);
    } else {
      this._router.navigate(['Login']);
    }
  }
}
