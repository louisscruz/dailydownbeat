import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertNotification } from '../../datatypes/alert/alertnotification';
import { User } from '../../datatypes/user/user';

import { AuthService } from '../../services/auth/authService';
import { AlertService } from '../../services/alerts/alertsService';
import { UserService } from '../../services/users/usersService';


@Component({
  selector: 'confirm',
  template: require('./confirm.html')
})

export class Confirm implements OnInit {
  private user: User;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _router: Router,
    private _userService: UserService) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      let id = params['id'];
      let confirmationCode = params['confirmation_code'];
      this._userService.confirmUser(id, confirmationCode)
      .subscribe(
        res => {
          this._authService.currentUser = res;
          this._authService.saveJwt(res.auth_token);
          console.log(this._authService.currentUser)
          console.log(this._authService.getToken());
          let alert = new AlertNotification('Your account has been confirmed!', 'success');
          this._alertService.addAlert(alert);
          this._router.navigate([ '/' ]);
        },
        err => {
          if (err.status === 403) {
            let alert = new AlertNotification('Your account was not in need of confirming.')
            this._alertService.addAlert(alert);
          } else {
            let alert = new AlertNotification('There was a problem confirming your account. If this happens again, contact us.', 'danger')
            this._alertService.addAlert(alert);
          }
          this._router.navigate([ '/' ]);
        }
      );
    });
  }
}
