import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators,
  AbstractControl,
  Control
} from 'angular2/common';

import {TAB_DIRECTIVES} from 'ng2-bootstrap';

import {UserService} from '../../services/users/usersService';

@Component({
  selector: 'dashboard',
  directives: [TAB_DIRECTIVES],
  template: require('./dashboard.html'),
  providers: [UserService]
})
export class Dashboard implements OnInit{
  private user: any;
  private posts: any;
  private comments: any;
  private editing: string;
  private active: boolean = true;
  private emailForm: ControlGroup;
  private newEmail: AbstractControl;
  private newEmailConfirm: AbstractControl;
  private passwordForm: ControlGroup;
  private oldPassword: AbstractControl;
  private newPassword: AbstractControl;
  private newPasswordConfirm: AbstractControl;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _routeParams: RouteParams,
    private _userService: UserService
  ) {
    this.emailForm = _fb.group({
      'newEmail': ['', Validators.compose([
        Validators.required])],
      'newEmailConfirm': ['', Validators.compose([
        Validators.required])]
    });
    this.newEmail = this.emailForm.controls['newEmail'];
    this.newEmailConfirm = this.emailForm.controls['newEmailConfirm'];
    this.passwordForm = _fb.group({
      'oldPassword': ['', Validators.compose([
        Validators.required])],
      'newPassword': ['', Validators.compose([
        Validators.required])],
      'newPasswordConfirm': ['', Validators.compose([
        Validators.required])]
    });
    this.oldPassword = this.passwordForm.controls['oldPassword'];
    this.newPassword = this.passwordForm.controls['newPassword'];
    this.newPasswordConfirm = this.passwordForm.controls['newPasswordConfirm'];
  }

  removeEditStatus() {
    this.editing = '';
  }

  updatePassword() {
    alert('working')
  }

  ngOnInit() {
    let id = this._routeParams.get('id');
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
