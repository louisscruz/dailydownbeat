import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl, Control} from 'angular2/common';
import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';

import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';
import {AuthService} from '../../services/auth/authService';
import {AlertService} from '../../services/alerts/alertsService';
import {User} from '../../datatypes/user/user';

@Component({
  selector: 'login',
  template: require('./login.html'),
  directives: [ ButtonRadio, FORM_DIRECTIVES ],
  bindings: [AuthService, AlertService]
})

export class Login {
  loginForm: ControlGroup;
  email: AbstractControl;
  password: AbstractControl;
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private fb: FormBuilder) {
      function emailValidator(control: Control): { [s: string]: boolean } {
        if (control.value.length > 0 && !control.value.match(/.+@.+\..+/i)) {
          return {invalidEmail: true};
        }
      }
      function passwordLengthValidator(control: Control): { [s: string]: boolean } {
        if (control.value != '' && control.value.length < 6) {
          return {passwordLengthInvalid: true}
        }
      }

      this.loginForm = fb.group({
        'email': ['', Validators.compose([
          Validators.required, emailValidator])],
        'password': ['', Validators.compose([
          Validators.required, passwordLengthValidator])]
      });
      this.email = this.loginForm.controls['email'];
      this.password = this.loginForm.controls['password'];

      this.authService = authService;
      this.alertService = alertService;
  }
  login(user) {
    console.log(user);
    this.authService.login(user);
    this.alertService.addAlert('Login attempted', 'success');
  }
}
