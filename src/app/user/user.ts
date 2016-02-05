import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {User} from '../datatypes/user/user';
import {UserService} from '../services/users/usersService';

@Component({
  selector: 'userDetail',
  template: require('./user.html'),
  providers: [UserService]
})

export class UserDetail implements OnInit {
  private user: User;

  constructor(
    private _router: Router,
    private _routeParams: RouteParams,
    private _userService: UserService) { }

  ngOnInit() {
    let id = this._routeParams.get('id');
    this._userService.getUser(id)
    .subscribe(
      res => this.user = res
    );
  }
}
