import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Modal } from 'angular2-modal/plugins/bootstrap';

//import { PaginationComponent } from '../directives/pagination/pagination.component';
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
  private comments: any;
  private userId: number;
  private postsCurrentPage: number = 1;
  private totalPosts: number;

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
        }, () => {}
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
              this.removePost(post);
              let alert = new AlertNotification('Successfully deleted post.', 'success');
              this._alertService.addAlert(alert);
            }, err => {
              let message = 'There was an error deleting that post.';
              let alert = new AlertNotification(message, 'danger')
              this._alertService.addAlert(alert);
            }, () => {}
          )
        },
        () => {}
      )
    });
  }

  removePost(post: Post): void {
    let minimumIndex: number = 0;
    let maximumIndex: number = this.posts.length - 1;

    while (minimumIndex <= maximumIndex) {
      let currentIndex = (minimumIndex + maximumIndex) / 2 | 0;

      if (this.posts[currentIndex].id < post.id) {
        maximumIndex = currentIndex - 1;
      } else if (this.posts[currentIndex].id > post.id) {
        minimumIndex = currentIndex + 1;
      } else {
        this.posts.splice(currentIndex, 1);
      }
    }
  }

  getUser(id: number) {
    this._userService.getUser(id)
    .subscribe(
      res => this.user = (<User>res)
    );
  }

  getUserPosts(id: number) {
    this._userService.getUserPosts(id)
    .subscribe(
      res => {
        this.posts = res
      }
    );
  }

  getUserComments(id: number) {
    this._userService.getUserComments(id)
    .subscribe(
      res => {
        this.comments = res;
      }
    );
  }

  postsPageChanged(event): void {
    this._activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      this.getUserPosts(id);
    });
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
