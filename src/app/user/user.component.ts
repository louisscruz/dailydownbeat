import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//import {TAB_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import { TabDirective } from '../directives/tabs/tab.directive';
import { TabsetComponent } from '../directives/tabs/tabset.component';
import { Pluralize } from '../directives/pluralize/pluralize';
import { DROPDOWN_DIRECTIVES } from '../directives/dropdown';

import { User } from '../datatypes/user/user';
import { Post } from '../datatypes/post/post';
import { Comment } from '../datatypes/comment/comment';
import { AuthService } from '../services/auth/authService';
import { UserService } from '../services/users/usersService';

import { TimeSincePipe } from '../pipes/timeSince';
import { OrderBy } from '../pipes/orderBy';

@Component({
  selector: 'user-detail',
  directives: [ TabDirective, TabsetComponent, Pluralize, DROPDOWN_DIRECTIVES ],
  template: require('./user.html'),
  styles: [ require('./user.scss') ],
  providers: [ UserService ],
  pipes: [ TimeSincePipe, OrderBy ]
})

export class UserDetail {
  private user: User;
  private posts: Post[];
  private comments: Comment[];
  private userId: number;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _authService: AuthService
  ) {
    this._activatedRoute.params.subscribe(params => {
      this.userId = +params['id'];
    });
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      let id = +params['id'];
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
