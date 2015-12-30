import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators} from 'angular2/common';
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
  user = new User('', '');

  constructor(
    fb: FormBuilder,
    private http: Http,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService) {
    function emailValidator(control: Control): { [s: string]: boolean} {
      if (!control.value.match(/.+@.+\..+/i)) {
        return {invalidEmail: true};
      }
    }
    this.loginForm = fb.group({
      'email': ['', Validators.compose([
        Validators.required, emailValidator])],
      'password': ['', Validators.required]
    });
    this.authService = authService;
    this.alertService = alertService;
  }
  login(user) {
    console.log(user);
    this.authService.login(user);
    this.alertService.addAlert('Login attempted', 'success');
  }
}
