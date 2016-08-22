import { Component } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES, CanActivate } from '@angular/router';
import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  FormControl,
  AbstractControl
} from '@angular/forms';

//import {TAB_DIRECTIVES, ButtonRadio} from 'ng2-bootstrap';

import { AlertService } from '../../services/alerts/alertsService';
import { UserService } from '../../services/users/usersService';
import { EmailValidator } from '../../directives/emailValidator/email.validator';
import { EqualsValidator } from '../../directives/equalsValidator/equals.validator';

import { tokenNotExpired } from 'angular2-jwt';

@Component({
  selector: 'dashboard',
  styles: [ require('./dashboard.scss') ],
  template: require('./dashboard.html'),
  directives: [ FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, EmailValidator, EqualsValidator ]
})
export class Dashboard {
  private user: any;
  private posts: any;
  private comments: any;
  private activitySelect: string = 'Posts';
  private editing: string;
  private emailForm: FormGroup;
  private passwordForm: FormGroup;
  private newEmail: AbstractControl;
  private newEmailConfirm: AbstractControl;
  private newEmailPassword: AbstractControl;
  private oldPassword: AbstractControl;
  private newPassword: AbstractControl;
  private confirmPassword: AbstractControl;

  constructor(
    private _alertService: AlertService,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.emailForm = new FormGroup({
      email: new FormControl(''),
      confirm: new FormControl(''),
      password: new FormControl('')
    });
    this.newEmail = this.emailForm.find('email');
    this.newEmailConfirm = this.emailForm.find('confirm');
    this.newEmailPassword = this.emailForm.find('password');

    this.passwordForm = new FormGroup({
      oldPassword: new FormControl(),
      newPassword: new FormControl(),
      confirmPassword: new FormControl()
    });
    this.oldPassword = this.passwordForm.find('oldPassword');
    this.newPassword = this.passwordForm.find('newPassword');
    this.confirmPassword = this.passwordForm.find('confirmPassword');
  }

  resetForm(form: FormGroup): void {
    console.log(this.emailForm)
    for (let key in form.controls) {
      //form.controls[key];
    }
  }

  setEdit(editing: string): void {
    if (editing === '' && this.editing === 'email') {
      this.resetForm(this.emailForm);
    } else if (editing === '' && this.editing === 'password') {
      this.resetForm(this.passwordForm);
    }
    this.editing = editing;
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
    this._activatedRoute.params.subscribe(params => {
      let id: number = +params['id'];
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
    });
  }
}
