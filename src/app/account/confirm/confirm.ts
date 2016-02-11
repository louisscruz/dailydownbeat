import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {User} from '../../datatypes/user/user';
import {UserService} from '../../services/users/usersService';


@Component({
  selector: 'confirm',
  template: require('./confirm.html'),
  providers: [UserService]
})

export class Confirm implements OnInit {
  private user: User;

  constructor(
    private _router: Router,
    private _routeParams: RouteParams,
    private _userService: UserService) { }

  ngOnInit() {
    let id = this._routeParams.get('id');
    let confirmationCode = this._routeParams.get('confirmation_code');
    this._userService.confirmUser(id, confirmationCode)
    .subscribe(
      res => console.log(res),
      err => console.log(err)
    )
  }
}
