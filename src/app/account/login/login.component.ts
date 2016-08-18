import {Component} from '@angular/core';
/*import {
FORM_DIRECTIVES,
FormBuilder,
ControlGroup,
Validators,
AbstractControl,
Control
} from '@angular/common';*/
import { Router } from '@angular/router';
import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  FormControl
} from '@angular/forms';

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

  constructor(
    private _authService: AuthService,
    private _alertService: AlertService,
    private _router: Router
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
        //this._authService.currentUser = res;
        //this._authService.saveJwt(res.auth_token);
      },
      err => {
        (<FormControl>this.loginForm.find('email')).updateValue('');
        (<FormControl>this.loginForm.find('password')).updateValue('');
        //(<FormControl>this.loginForm.find('password')).pristine = true;
        let alert = new AlertNotification('test', 'danger');
        this._alertService.addAlert(alert);
      },
      () => {
        this._router.navigate([ './' ]);
      }
    )
  }
}
