import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {User} from '../../datatypes/user/user';
import {UserService} from '../../services/users/usersService';
import {AlertService} from '../../services/alerts/alertsService';


@Component({
  selector: 'confirm',
  template: require('./confirm.html'),
  providers: [UserService, AlertService]
})

export class Confirm implements OnInit {
  private user: User;

  constructor(
    private _router: Router,
    private _routeParams: RouteParams,
    private _userService: UserService,
    private _alertService: AlertService) { }

  ngOnInit() {
    let id = this._routeParams.get('id');
    let confirmationCode = this._routeParams.get('confirmation_code');
    this._userService.confirmUser(id, confirmationCode)
    .subscribe(
      res => {
        this._alertService.addAlert('Your account has been confirmed.', 'success');
        this._router.navigate(['Home']);
      },
      err => {
        if (err.status === 403) {
          this._alertService.addAlert('Your account was not in need of confirmation.');
        } else {
          this._alertService.addAlert('There was a problem with the confirmation of your account. If this fails after another try, contact us.');
        }
        this._router.navigate(['Home']);
      }
    )
  }
}
