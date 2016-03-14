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

//import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';
import {AuthHttp, JwtHelper, AuthConfig} from 'angular2-jwt';

import {AuthService} from '../../services/auth/authService';
import {AlertService} from '../../services/alerts/alertsService';
import {User} from '../../datatypes/user/user';

@Component({
  selector: 'login',
  template: require('./login.html'),
  directives: [],
  providers: []
})

export class Login {
  private loginForm: ControlGroup;
  private email: AbstractControl;
  private password: AbstractControl;

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
    this.loginForm = _fb.group({
      'email': ['', Validators.compose([
        Validators.required, emailValidator])],
      'password': ['', Validators.compose([
        Validators.required])]
    });
    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];
  }
  login(user: User): void {
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
  }
}
