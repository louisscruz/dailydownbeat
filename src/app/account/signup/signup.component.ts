import {Component} from '@angular/core';
import {
  FORM_DIRECTIVES,
  //FORM_BINDINGS,
  FormBuilder,
  ControlGroup,
  Control,
  Validators,
  AbstractControl
} from '@angular/common';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/authService';
import {User} from '../../datatypes/user/user';
//import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'signup',
  template: require('./signup.html'),
  directives: [ FORM_DIRECTIVES ],
  providers: [AuthService]
})

export class Signup {
  signupForm: ControlGroup;
  user: User;
  username: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  password_confirmation: AbstractControl;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _http: Http,
    private _router: Router
  ) {
    // TODO: refactor form validators to be global
    function emailValidator(control: Control): { [s: string]: boolean } {
      if (!control.value.match(/.+@.+\..+/i)) {
        return {invalidEmail: true};
      }
    }
    function confirmationEquivalent(passwordKey: string, passwordConfirmationKey: string): any {
      return (group: ControlGroup) => {
        let passwordInput = group.controls[passwordKey];
        let passwordConfirmationInput = group.controls[passwordConfirmationKey];
        if (passwordInput.value !== passwordConfirmationInput.value) {
          return passwordConfirmationInput.setErrors({notEquivalent: true});
        }
      };
    }
    this.signupForm = _fb.group({
      'username': ['', Validators.compose([
        Validators.required, Validators.maxLength(24)])],
      'email': ['', Validators.compose([
        Validators.required, emailValidator])],
      'password': ['', Validators.compose([
        Validators.required, Validators.minLength(8)])],
      'password_confirmation': ['', Validators.compose([
        Validators.required])]
    }, {validator: confirmationEquivalent('password', 'password_confirmation')});
    this.username = this.signupForm.controls['username'];
    this.email = this.signupForm.controls['email'];
    this.password = this.signupForm.controls['password'];
    this.password_confirmation = this.signupForm.controls['password_confirmation'];
    this._authService = _authService;
  }
}
