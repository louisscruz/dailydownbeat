import { Component } from '@angular/core';
import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { AlertNotification } from '../../datatypes/alert/alertnotification';
import { User } from '../../datatypes/user/user';

import { EmailAvailabilityValidator } from '../../directives/emailAvailabilityValidator/email-availability.validator';
import { EmailValidator } from '../../directives/emailValidator/email.validator';
import { EqualsValidator } from '../../directives/equalsValidator/equals.validator';
import { UsernameAvailabilityValidator } from '../../directives/username-availability-validator/username-availability.validator';

import { AlertService } from '../../services/alerts/alertsService';
import { AuthService } from '../../services/auth/authService';
import { UserService } from '../../services/users/usersService';

@Component({
  selector: 'signup',
  template: require('./signup.html'),
  directives: [ FORM_DIRECTIVES, EmailValidator, EmailAvailabilityValidator, EqualsValidator, UsernameAvailabilityValidator ]
})

export class Signup {
  private signupForm: FormGroup;
  private username: AbstractControl;
  private email: AbstractControl;
  private password: AbstractControl;
  private passwordConfirmation: AbstractControl;

  constructor(
    private _alertService: AlertService,
    private _authService: AuthService,
    private _http: Http,
    private _router: Router,
    private _userService: UserService
  ) {
    /*this.signupForm = _fb.group({
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
    this._authService = _authService;*/
    this.signupForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      passwordConfirmation: new FormControl('')
    });
    this.username = this.signupForm.find('username');
    this.email = this.signupForm.find('email');
    this.password = this.signupForm.find('password');
    this.passwordConfirmation = this.signupForm.find('passwordConfirmation');
  }

  postUser(): void {
    this._userService.postUser(this.signupForm.value).subscribe(
      res => {
        let alert = new AlertNotification('Congratulations! Your account has been created!', 'success');
        this._alertService.addAlert(alert);
        this._router.navigate([ '/' ]);
        console.log(res);
        console.log(res.headers)
      }, err => {
        let alert = new AlertNotification('There was an error while creating your account. Try logging in. If that doesn\'t work, try creating your account again. If that doesn\'t work, contact us.', 'danger', 0);
        console.log(err)
        this._alertService.addAlert(alert);
        this._router.navigate([ '/' ]);
      }, () => {

      }
    )
  }
}
