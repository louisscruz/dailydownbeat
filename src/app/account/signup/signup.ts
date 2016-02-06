import {Component} from 'angular2/core';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Control,
  Validators,
  AbstractControl
} from 'angular2/common';
import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {AuthService} from '../../services/auth/authService';
import {User} from '../../datatypes/user/user';
import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'signup',
  template: require('./signup.html'),
  directives: [ ButtonRadio, FORM_DIRECTIVES ],
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
    fb: FormBuilder,
    private authService: AuthService,
    http: Http,
    router: Router) {
    function emailValidator(control: Control): { [s: string]: boolean } {
      if (!control.value.match(/.+@.+\..+/i)) {
        return {invalidEmail: true};
      }
    }
    function confirmationEquivalent(control: Control): { [s: string]: boolean } {
      if (control.value !== 'test') {
        //console.log(control);
        return {notEquivalent: true};
      }
    }
    this.signupForm = fb.group({
      'username': ['', Validators.required],
      'email': ['', Validators.compose([
        Validators.required, emailValidator])],
      'password': ['', Validators.required],
      'password_confirmation': ['', Validators.compose([
        Validators.required, confirmationEquivalent])]
    });
    this.username = this.signupForm.controls['username'];
    this.email = this.signupForm.controls['email'];
    this.password = this.signupForm.controls['password'];
    this.password_confirmation = this.signupForm.controls['password_confirmation'];
    this.authService = authService;
  }
}
