import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES, CanActivate } from '@angular/router';
import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { tokenNotExpired } from 'angular2-jwt';

import { AlertNotification } from '../../datatypes/alert/alertnotification';

import { EmailAvailabilityValidator } from '../../directives/emailAvailabilityValidator/email-availability.validator';
import { EmailValidator } from '../../directives/emailValidator/email.validator';
import { EqualsValidator } from '../../directives/equalsValidator/equals.validator';

import { AlertService } from '../../services/alerts/alertsService';
import { UserService } from '../../services/users/usersService';

@Component({
  selector: 'dashboard',
  styles: [ require('./dashboard.scss') ],
  template: require('./dashboard.html'),
  directives: [
    FORM_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES,
    EmailAvailabilityValidator,
    EmailValidator,
    EqualsValidator
  ]
})
export class Dashboard {
  private user: any;
  private posts: any;
  private comments: any;
  private activitySelect: string = 'Posts';
  private editing: string;
  private bioForm: FormGroup;
  private emailForm: FormGroup;
  private passwordForm: FormGroup;
  private newBio: AbstractControl;
  private newEmail: AbstractControl;
  private newEmailConfirm: AbstractControl;
  private newEmailPassword: AbstractControl;
  private oldPassword: AbstractControl;
  private newPassword: AbstractControl;
  private newPasswordConfirmation: AbstractControl;
  private validatingEmail: boolean = false;
  private processing: boolean = false;

  constructor(
    private _alertService: AlertService,
    private _activatedRoute: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _userService: UserService,
    private router: Router
  ) {
    this.bioForm = new FormGroup({
      newBio: new FormControl('')
    });
    this.newBio = this.bioForm.find('newBio');

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
      newPasswordConfirmation: new FormControl()
    });
    this.oldPassword = this.passwordForm.find('oldPassword');
    this.newPassword = this.passwordForm.find('newPassword');
    this.newPasswordConfirmation = this.passwordForm.find('newPasswordConfirmation');
  }

  resetForm(form: FormGroup): void {
    // Reset the form (manually until RC5)
    //for (let key in form.controls) {
      //form.controls[key].updateValueAndValidity('');
    //}
  }

  setEdit(editing: string): void {
    if (editing === '' && this.editing === 'bio') {
      this.resetForm(this.bioForm);
    } else if (editing === '' && this.editing === 'email') {
      this.resetForm(this.emailForm);
    } else if (editing === '' && this.editing === 'password') {
      this.resetForm(this.passwordForm);
    }
    this.editing = editing;
    this._cd.detectChanges()
  }

  toggleValidatingEmail(): void {
    this.validatingEmail = !this.validatingEmail;
  }

  updateBio(): void {
    this.processing = true;
    this._userService.updateBio(this.newBio.value)
    .subscribe(
      res => {
        let alert = new AlertNotification('Bio successuflly changed!', 'success');
        this._alertService.addAlert(alert);
      }, err => {
        let body = JSON.parse(err._body);
        this.processing = false;
        let alert = new AlertNotification('Error changing bio', 'danger');
        this._alertService.addAlert(alert);
        this.setEdit('');
      }, () => {
        this.processing = false;
        this.router.navigate([ '/user', this.user.username ]);
      }
    );
  }

  updateEmail(): void {
    this.processing = true;
    this._userService.updateEmail(this.newEmail.value, this.newEmailPassword.value)
    .subscribe(
      res => {
        let alert = new AlertNotification('Email successfully changed! Contact us if you don\'t receive an email confirming this in the next ten minutes.', 'success');
        this._alertService.addAlert(alert);
      }, err => {
        let body = JSON.parse(err._body);
        let alert = new AlertNotification('Error changing email.', 'danger');
        if (body['current_password'][0] === 'is invalid') {
          alert.message = 'Invalid password';
        }
        this._alertService.addAlert(alert);
        this.setEdit('');
      }, () => {
        this.processing = false;
        this.router.navigate([ '/' ]);
      }
    );
  }

  updatePassword(): void {
    this.processing = true;
    this._userService.updatePassword(
      this.oldPassword.value,
      this.newPassword.value,
      this.newPasswordConfirmation.value
    ).subscribe(
      res => {
        let alert = new AlertNotification('Password succcessfully changed!', 'success');
        this._alertService.addAlert(alert);
      }, err => {
        let body = JSON.parse(err._body);
        let alert = new AlertNotification('Error changing email.', 'danger');
        if (body['current_password'][0] === 'is invalid') {
          alert.message = 'Invalid current password.';
        }
        this._alertService.addAlert(alert);
        this.setEdit('');
      }, () => {
        this.processing = false;
        this.router.navigate([ '/' ]);
      }
    )
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      let username: string = params['username'];
      this._userService.getUser(username)
      .subscribe(
        res => {
          this.user = res
          if (this.user.bio) { (<FormControl>this.newBio).updateValue(this.user.bio) }
        }
      );
      this._userService.getUserPosts(username)
      .subscribe(
        res => this.posts = res
      );
      this._userService.getUserComments(username)
      .subscribe(
        res => this.comments = res
      );
    });
  }
}
