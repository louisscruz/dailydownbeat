import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {Http} from 'angular2/http';

import {AuthService} from '../services/auth/authService';

@Component({
  selector: 'navbar',
  directives: [ROUTER_DIRECTIVES],
  pipes: [],
  styles: [ require('./navbar.scss') ],
  template: require('./navbar.html'),
  bindings: [AuthService]
})
export class Navbar {
  isLoggedIn = 'yes';
  constructor(private authService: AuthService) {
    this.authService = authService;
    authService.isLoggedIn();
  }

}
