import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {Http} from 'angular2/http';

import {UserService} from '../services/users/usersService';

@Component({
  selector: 'navbar',
  directives: [ROUTER_DIRECTIVES],
  pipes: [],
  styles: [ require('./navbar.scss') ],
  template: require('./navbar.html'),
  bindings: [UserService]
})
export class Navbar {
  constructor(private userService: UserService) {
    this.userService = userService;
  }
}
