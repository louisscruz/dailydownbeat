import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { AuthHttp, JwtHelper, AuthConfig } from 'angular2-jwt';

import { AuthService } from '../../services/auth/authService';
import { AlertService } from '../../services/alerts/alertsService';
import { User } from '../../datatypes/user/user';
import { AlertNotification } from '../../datatypes/alert/alertnotification';

import { EmailValidator } from '../../directives/emailValidator/email.validator';

@Component({
  selector: 'login',
  template: require('./login.html'),
  directives: [ FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, EmailValidator ],
  providers: []
})

export class Login {
  private loginForm: FormGroup;
  private redirect: Observable<string>;

  constructor(
    private _authService: AuthService,
    private _alertService: AlertService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  login(user) {
    this._authService.login(user)
    .subscribe(
      res => {
        this._authService.currentUser = res;
        this._authService.saveJwt(res.auth_token);
      },
      err => {
        console.log(err);
        (<FormControl>this.loginForm.find('email')).updateValue('');
        this.loginForm.controls['email']['_touched'] = false;
        (<FormControl>this.loginForm.find('password')).updateValue('');
        this.loginForm.controls['password']['_touched'] = false;
        let alert = new AlertNotification('Email address or password is invalid.', 'danger');
        this._alertService.addAlert(alert);
      },
      () => {
        let redirect = (<any>this._router.routerState.queryParams).value['session_redirect'];
        if (redirect === undefined) {
          this._router.navigate([ './' ]);
        } else {
          this._router.navigateByUrl(redirect);
        }
      }
    )
  }
}
