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

import { EmailValidator } from '../../directives/emailValidator/email.validator';

@Component({
  selector: 'login',
  template: require('./login.html'),
  directives: [ FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, EmailValidator ],
  providers: [ AlertService ]
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
    alert('about to work')
    this._authService.login(user)
    .subscribe(
      res => {
        //this._authService.currentUser = res;
        //this._authService.saveJwt(res.auth_token);
        console.log(res);
        alert('halting');
      },
      err => {
        (<FormControl>this.loginForm.find('password')).updateValue('');
        (<FormControl>this.loginForm.find('password')).pristine = true;
      },
      () => {
        this._router.navigate([ 'Home' ]);
      }
    )
  }

    /*login(user: User): void {
    this._authService.login(user)
    .subscribe(
    res => {
    this._authService.currentUser = res;
    this._authService.saveJwt(res.auth_token);
  },
  err => {
  console.log('in error');
  (<Control>this.loginForm.controls['password']).updateValue('');
  (<Control>this.loginForm.controls['password']).pristine = true;
  console.log('in error');
  this._alertService.addAlert({
  'message': 'Incorrect email or password',
  'type': 'danger',
  'timeout': 8000,
  'dismissible': true
});
},
() => {
this._router.navigate(['Home']);
}
);
}*/
}
