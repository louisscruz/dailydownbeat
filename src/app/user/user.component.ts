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
  private postsCurrentPage: number = 1;
  private totalPosts: number;
  private sendingVote: number = null;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _postService: PostService,
    private _router: Router,
    private _userService: UserService,
    private modal: Modal
  ) {}

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

  getUser(username: string) {
    this._userService.getUser(username)
    .subscribe(
      res => {
        this.user = (<User>res);
        ga('send', 'event', {
          'eventCategory': 'Users',
          'eventAction': 'Get',
          'eventLabel': username
        });
      }
    );
  }

  getUserPosts(username: string) {
    this._userService.getUserPosts(username)
    .subscribe(
      res => {
        this.posts = res
      }
    );
  }

  getUserComments(username: string) {
    this._userService.getUserComments(username)
    .subscribe(
      res => {
        this.comments = res;
      }
    );
  }

  postsPageChanged(event): void {
    this._activatedRoute.params.subscribe(params => {
      let username = params['username'];
      this.getUserPosts(username);
    });
  }

  handleUpvote(post: Post) {
    if (this._authService.currentUser) {
      post.upvoted ? this.unvote(post, 1) : this.upvote(post);
    } else {
      let alert = new AlertNotification('You have to be logged in to vote!', 'warning');
      this._alertService.addAlert(alert);
    }
  }

  handleDownvote(post: Post) {
    if (this._authService.currentUser) {
      post.downvoted ? this.unvote(post, -1) : this.downvote(post);
    } else {
      let alert = new AlertNotification('You have to be logged in to vote!', 'warning');
      this._alertService.addAlert(alert);
    }
  }

  upvote(post: Post) {
    this.sendingVote = post.id;
    this._postService.upvote(post).subscribe(
      res => {
        let alert = new AlertNotification('Successfully upvoted post!', 'success', 3000);
        this._alertService.addAlert(alert);
        post.downvoted ? post.points += 2 : post.points++;
        post.upvoted = true;
        post.downvoted = false;
        this.sendingVote = null;
        ga('send', 'event', {
          'eventCategory': 'Votes',
          'eventAction': 'Post Upvote',
          'eventLabel': post.title
        });
      }, err => {
        console.log(err);
        let alert = new AlertNotification('There was a problem sending your vote.', 'danger');
        let body = JSON.parse(err._body);
        console.log(body['user'])
        if (body['user'] && body['user'][0] === 'must be confirmed to make posts.') {
          alert.message = 'You must first confirm your account before voting. We sent you an email to handle this when you created your account.';
        } else if (err.status === 401) {
          alert.message = 'You have to be logged in to vote.';
          alert.type = 'warning';
        }
        this._alertService.addAlert(alert);
        this.sendingVote = null;
      }
    );
  }

  downvote(post: Post) {
    this.sendingVote = post.id;
    this._postService.downvote(post).subscribe(
      res => {
        let alert = new AlertNotification('Successfully downvoted post!', 'success', 3000);
        this._alertService.addAlert(alert);
        post.upvoted ? post.points -= 2 : post.points--;
        post.downvoted = true;
        post.upvoted = false;
        this.sendingVote = null;
        ga('send', 'event', {
          'eventCategory': 'Votes',
          'eventAction': 'Post Downvote',
          'eventLabel': post.title
        });
      }, err => {
        console.log(err);
        let alert = new AlertNotification('There was a problem sending your vote.', 'danger');
        let body = JSON.parse(err._body);
        if (body['user'] && body['user'][0] === 'must be confirmed to make posts.') {
          alert.message = 'You must first confirm your account before voting. We sent you an email to handle this when you created your account.';
        } else if (err.status == 401) {
          alert.message = 'You have to be logged in to vote.';
          alert.type = 'warning';
        }
        this._alertService.addAlert(alert);
        this.sendingVote = null;
      }
    );
  }

  unvote(post: Post, polarity: number) {
    this.sendingVote = post.id;
    this._postService.unvote(post).subscribe(
      res => {
        let alert = new AlertNotification('Vote successfully updated!', 'success', 3000);
        this._alertService.addAlert(alert);
        post.points -= polarity;
        post.upvoted = false;
        post.downvoted = false;
        this.sendingVote = null;
        ga('send', 'event', {
          'eventCategory': 'Votes',
          'eventAction': 'Post Unvote',
          'eventLabel': post.title
        });
      }, err => {
        let alert = new AlertNotification('There was a problem changing the status of your vote.', 'danger');
        this._alertService.addAlert(alert);
        this.sendingVote = null;
      }
    );
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      let username = params['username'];
      this.getUser(username);
      this.getUserPosts(username);
      this.getUserComments(username);
    });
  }
}
