import {Component} from 'angular2/core';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators,
  AbstractControl,
  Control
} from 'angular2/common';
import {Router} from 'angular2/router';

import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';
import {AuthHttp, JwtHelper, AuthConfig} from 'angular2-jwt';

import {AuthService} from '../../services/auth/authService';
import {AlertService} from '../../services/alerts/alertsService';
import {User} from '../../datatypes/user/user';

@Component({
  selector: 'login',
  template: require('./login.html'),
  directives: [ ButtonRadio, FORM_DIRECTIVES ],
  providers: [AlertService]
})

export class Login {
  private loginForm: ControlGroup;
  private email: AbstractControl;
  private password: AbstractControl;
  private login: any;
  constructor(
    private _authService: AuthService,
    private _alertService: AlertService,
    private _fb: FormBuilder,
    private _router: Router) {
    function emailValidator(control: Control): { [s: string]: boolean } {
      if (control.value.length > 0 && !control.value.match(/.+@.+\..+/i)) {
        return {invalidEmail: true};
      }
    }
    /*function passwordLengthValidator(control: Control): { [s: string]: boolean } {
      if (control.value !== '' && control.value.length < 6) {
        return {passwordLengthInvalid: true};
      }
    }*/
    this.loginForm = _fb.group({
      'email': ['', Validators.compose([
        Validators.required, emailValidator])],
      'password': ['', Validators.compose([
        Validators.required])]
    });
    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];

    //this._alertService = _alertService;
    this.login = function(user) {
      console.log('inside login.ts function');
      this._authService.login(user)
      .subscribe(
        res => {
          this._authService.currentUser = res;
          this._authService.saveJwt(res.auth_token);
        },
        err => {
          (<Control>this.loginForm.controls['password']).updateValue('');
          (<Control>this.loginForm.controls['password']).pristine = true;
          //this._alertService.addAlert('There was an error loggin in.', 'danger');
          this._alertService.addAlert({
            'message': 'Incorrect email or password',
            'type': 'danger'
          });
        },
        () => {
          this._router.navigate(['Home']);
        }
      );
    };
  }
}
