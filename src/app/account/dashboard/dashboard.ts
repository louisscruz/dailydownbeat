import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

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
  constructor(
    private _router: Router,
    private _routeParams: RouteParams,
    private _userService: UserService
  ) {}
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
