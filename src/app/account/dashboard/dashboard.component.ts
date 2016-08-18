import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
/*import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators,
  AbstractControl,
  Control
} from 'angular2/common';*/

//import {TAB_DIRECTIVES, ButtonRadio} from 'ng2-bootstrap';

import {AlertService} from '../../services/alerts/alertsService';
import {UserService} from '../../services/users/usersService';

@Component({
  selector: 'dashboard',
  //directives: [TAB_DIRECTIVES, ButtonRadio],
  styles: [ require('./dashboard.scss') ],
  template: require('./dashboard.html'),
  providers: [AlertService, UserService, ActivatedRoute]
})
export class Dashboard {
  private user: any;
  private posts: any;
  private comments: any;
  private activitySelect: string = 'Posts';
  private editing: string;
  /*private emailForm: ControlGroup;
  private newEmail: AbstractControl;
  private newEmailConfirm: AbstractControl;
  private newEmailPassword: AbstractControl;
  private passwordForm: ControlGroup;
  private oldPassword: AbstractControl;
  private newPassword: AbstractControl;
  private newPasswordConfirm: AbstractControl;*/

  constructor(
    /*private _fb: FormBuilder,
    private _router: Router,
    private _routeParams: RouteParams,*/
    private _alertService: AlertService,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute
  ) {
    /*function emailValidator(control: Control): { [s: string]: boolean } {
      if (!control.value.match(/.+@.+\..+/i) && control.value.length > 0) {
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
    }*/

  }

  removeEditStatus(): void {
    this.editing = '';
  }

  /*updateEmail(): void {
    this._userService.updateEmail(this.newEmail.value, this.newEmailPassword.value)
    .subscribe(
      res => {
        this._alertService.addAlert({
          'message': 'Email successfully changed!',
          'type': 'success',
          'timeout': 8000,
          'dismissible': true
        });
      }, err => {

      }, () => {
        this.removeEditStatus();
      }
    );
  }*/

  /*updatePassword(): void {
    this._userService.updatePassword(
      this.oldPassword.value,
      this.newPassword.value,
      this.newPasswordConfirm.value)
    .subscribe(
      res => {
        this._alertService.addAlert({
          'message': 'Password updated! An email has been sent to revalidate your account.',
          'type': 'success',
          'timeout': 20000,
          'dismissible': true
        });
      }, err => {
        if (err.status === 401) {
          this._alertService.addAlert({
            'message': 'Incorrect password!',
            'type': 'danger',
            'timeout': 8000,
            'dismissible': false
          });
        } else if (err.status === 422) {
          this._alertService.addAlert({
            'message': 'Password must be new!',
            'type': 'danger',
            'timeout': 8000,
            'dismissible': false
          });
        }
      }, () => {
        this.removeEditStatus();
      }
    );
  }*/

  ngOnInit(): void {
    let id = this._activatedRoute.params['id'];
    this._userService.getUser(id)
    .subscribe(
      res => this.user = res
    );
    this._userService.getUserPosts(id)
    .subscribe(
      res => this.posts = res
    );
    this._userService.getUserComments(id)
    .subscribe(
      res => this.comments = res
    );
  }
}