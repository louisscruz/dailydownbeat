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
  isLoggedIn = 'yes';
  public isCollapsed: boolean = true;
  public toggleCollapse: any;
  public collapse: any;
  constructor(private authService: AuthService) {
    this.authService = authService;
    this.isCollapsed;
    this.toggleCollapse = function() {
      this.isCollapsed = !this.isCollapsed;
    }
    this.collapse = function() {
      this.isCollapsed = true;
    }
    authService.isLoggedIn();
  }

}
