import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, Router} from 'angular2/router';
import {Http} from 'angular2/http';
import {Collapse} from 'ng2-bootstrap/ng2-bootstrap';

import {AuthService} from '../services/auth/authService';
import {AlertService} from '../services/alerts/alertsService';

@Component({
  selector: 'navbar',
  directives: [ROUTER_DIRECTIVES, Collapse],
  pipes: [],
  styles: [ require('../global-variables.scss'), require('./navbar.scss') ],
  template: require('./navbar.html'),
  bindings: [AuthService]
})
export class Navbar {
  private isAuth: boolean = false;
  private isCollapsed: boolean = true;
  private toggleCollapse: any;
  private collapse: any;
  private logout: any;
  constructor(private authService: AuthService, private router: Router) {
    this.authService = authService;
    this.toggleCollapse = function() {
      this.isCollapsed = !this.isCollapsed;
    };
    this.collapse = function() {
      this.isCollapsed = true;
    };
    this.logout = function() {
      alert('loggin out');
      this.authService.logout()
      .subscribe(
        data => console.log(data),
        err => console.log(err),
        () => {
          console.log('success');
          authService.deleteJwt();
          this.router.navigate(['Home']);
        }
      );
    };
  }
}
