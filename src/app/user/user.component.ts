import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { TabDirective } from '../directives/tabs/tab.directive';
import { TabsetComponent } from '../directives/tabs/tabset.component';
import { Pluralize } from '../directives/pluralize/pluralize';
import { DROPDOWN_DIRECTIVES } from '../directives/dropdown';

import { AlertNotification } from '../datatypes/alert/alertnotification';
import { Comment } from '../datatypes/comment/comment';
import { Post } from '../datatypes/post/post';
import { User } from '../datatypes/user/user';
import { flagContent, deleteContent } from '../modal/modalPresets';

import { AlertService } from '../services/alerts/alertsService';
import { AuthService } from '../services/auth/authService';
import { PostService } from '../services/posts/postsService';
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
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _postService: PostService,
    private _router: Router,
    private _userService: UserService,
    private modal: Modal
  ) {
    this._activatedRoute.params.subscribe(params => {
      this.userId = +params['id'];
    });
  }

  openFlagModal(post: Post) {
    let preset = flagContent(this.modal, post.title, this.user.username);
    let dialog = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          this._postService.flagPost(post).subscribe(
            res => {
              // Reload posts
            }, err => {
              let message: string = 'There was an error flagging the post.';
              let alert = new AlertNotification(message, 'danger');
              this._alertService.addAlert(alert);
            }
          )
        }, () => console.log('error confirming modal')
      )
    });
  }

  openDeleteModal(post: Post) {
    let preset = deleteContent(this.modal, post.title, String(this.user.id));
    let dialog = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          this._postService.deletePost(post).subscribe(
            res => {
              alert('success');
              // Reload posts
            }, err => {
              let message = 'There was an error deleting that post.';
              let alert = new AlertNotification(message, 'danger')
              this._alertService.addAlert(alert);
            }, () => {

            }
          )
        },
        () => console.log('error confirming modal')
      )
    });
  }

  getUser(id: number) {
    this._userService.getUser(id)
    .subscribe(
      res => this.user = res
    );
  }

  getUserPosts(id: number) {
    this._userService.getUserPosts(id)
    .subscribe(
      res => this.posts = res
    );
  }

  getUserComments(id: number) {
    this._userService.getUserComments(id)
    .subscribe(
      res => this.comments = res
    );
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      this.getUser(id);
      this.getUserPosts(id);
      this.getUserComments(id);
    });
  }
}
