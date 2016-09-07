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
import { Modal, BS_MODAL_PROVIDERS } from 'angular2-modal/plugins/bootstrap';

import { AlertNotification } from '../../datatypes/alert/alertnotification';
import { User } from '../../datatypes/user/user';
import { terms } from '../../modal/modalPresets';

import { CheckboxValidator } from '../../directives/require-check/require-check.validator';
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
  directives: [
    FORM_DIRECTIVES,
    CheckboxValidator,
    EmailValidator,
    EmailAvailabilityValidator,
    EqualsValidator,
    UsernameAvailabilityValidator
  ]
})

export class Signup {
  private signupForm: FormGroup;
  private username: AbstractControl;
  private email: AbstractControl;
  private password: AbstractControl;
  private passwordConfirmation: AbstractControl;
  private terms: AbstractControl;
  private processing: boolean = false;

  constructor(
    private _alertService: AlertService,
    private _authService: AuthService,
    private _http: Http,
    private _router: Router,
    private _userService: UserService,
    private modal: Modal
  ) {
    this.signupForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      passwordConfirmation: new FormControl(''),
      terms: new FormControl(false)
    });
    this.username = this.signupForm.find('username');
    this.email = this.signupForm.find('email');
    this.password = this.signupForm.find('password');
    this.passwordConfirmation = this.signupForm.find('passwordConfirmation');
    this.terms = this.signupForm.find('terms');
  }

  openTermsModal() {
    let preset = terms(this.modal);
    let dialog = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        res => {},
        err => {}
      );
    });
  }

  postUser(): void {
    this.processing = true;
    let user = {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
      passwordConfirmation: this.passwordConfirmation.value
    };
    this._userService.postUser(user).subscribe(
      res => {
        let body = JSON.parse(res._body);
        this._authService.currentUser = body;
        this._authService.saveJwt(body.auth_token);
        let alert = new AlertNotification('Congratulations! Your account has been created! Check your email – you\'ll just have to confirm your account before making posts.', 'success');
        this._alertService.addAlert(alert);
        this._router.navigate([ '/' ]);
        ga('send', 'event', {
          'eventCategory': 'Users',
          'eventAction': 'Create',
          'eventLabel': user.username
        });
      }, err => {
        let alert = new AlertNotification('There was an error while creating your account. Try logging in. If that doesn\'t work, try creating your account again. If that doesn\'t work, contact us.', 'danger', 0);
        console.log(err);
        this._alertService.addAlert(alert);
        this._router.navigate([ '/' ]);
      }, () => {
        let redirect = (<any>this._router.routerState.queryParams).value['session_redirect'];
        this.processing = false;
        if (redirect === undefined) {
          this._router.navigate([ '/' ]);
        } else {
          this._router.navigateByUrl(redirect);
        }
      }
    );
  }
}
