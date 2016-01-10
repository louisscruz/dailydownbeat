import {Component} from 'angular2/core';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators,
  AbstractControl,
  Control
} from 'angular2/common';
import {HTTP_PROVIDERS, Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';

import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';
import {AuthHttp} from 'angular2-jwt';

import {AuthService} from '../../services/auth/authService';
import {AlertService} from '../../services/alerts/alertsService';
import {User} from '../../datatypes/user/user';

@Component({
  selector: 'login',
  template: require('./login.html'),
  directives: [ ButtonRadio, FORM_DIRECTIVES ],
  providers: [AuthService, AlertService, HTTP_PROVIDERS, Http, AuthHttp]
})

export class Login {
  loginForm: ControlGroup;
  email: AbstractControl;
  password: AbstractControl;
  constructor(
    private http: Http,
    private authService: AuthService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router) {
      function emailValidator(control: Control): { [s: string]: boolean } {
        if (control.value.length > 0 && !control.value.match(/.+@.+\..+/i)) {
          return {invalidEmail: true};
        }
      }
      function passwordLengthValidator(control: Control): { [s: string]: boolean } {
        if (control.value !== '' && control.value.length < 6) {
          return {passwordLengthInvalid: true};
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
    this.authService.login(user)
    .subscribe(
      res => {
        this.authService.saveJwt(res.auth_token);
      },
      err => {
        (<Control>this.loginForm.controls['password']).updateValue('');
        (<Control>this.loginForm.controls['password']).pristine = true;
        this.alertService.addAlert('There was an error loggin in.', 'danger');
      },
      () => {
        this.authService.token = localStorage.getItem('auth_token');
        this.router.navigate(['Home']);
      }
    );
  }
}
