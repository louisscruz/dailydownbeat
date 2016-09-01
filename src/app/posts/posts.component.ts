import { Component, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HTTP_PROVIDERS, Http, Headers } from '@angular/http';
import { CORE_DIRECTIVES } from '@angular/common';
import { FORM_DIRECTIVES } from '@angular/forms';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { PagerComponent } from '../directives/pager/pager.component';
import { DROPDOWN_DIRECTIVES } from '../directives/dropdown';
import { Pluralize } from '../directives/pluralize/pluralize';

import { AlertService } from '../services/alerts/alertsService';
import { AuthService } from '../services/auth/authService';
import { PostService } from '../services/posts/postsService';

import { AlertNotification } from '../datatypes/alert/alertnotification';
import { Post } from '../datatypes/post/post';

import { TimeSincePipe } from '../pipes/timeSince.ts';

import { flagContent, deleteContent } from '../modal/modalPresets';

@Component({
  selector: 'posts',
  template: require('./posts.html'),
  directives: [ PagerComponent, CORE_DIRECTIVES, FORM_DIRECTIVES, RouterLink, DROPDOWN_DIRECTIVES, Pluralize ],
  pipes: [ TimeSincePipe ],
  styles: [ require('./posts.scss') ]
})

export class Posts {
  private currentKind: string = 'all';
  private posts: Array<Post>;
  private totalItems: number = 30;
  private currentPage: number = 1;
  private pageOffset: number = 0;
  private perPage: number = 30;
  private loadingPosts: boolean = false;
  private serverDown: boolean = false;
  private sendingVote: number;

  constructor(
    private _router: Router,
    private _postService: PostService,
    private _authService: AuthService,
    private _alertService: AlertService,
    private modal: Modal,
  ) {}

  setContentSelect(kind: string) {
    if (this.currentKind !== kind) {
      this.getPosts(1, this.perPage, kind);
      this.currentKind = kind;
      this.currentPage = 1;
    }
  }

  setPageOffset(currentPage) {
    this.pageOffset = ((this.currentPage - 1) * this.perPage);
  }

  getPosts(page, per_page, kind='all') {
    this.loadingPosts = true;
    this._postService.getPosts(page, per_page, kind)
    .map(res => {
      this.totalItems = Number(res.headers.get('X-Total-Count'));
      return res.json();
    })
    .map((posts: Array<any>) => {
      let result: Array<Post> = [];
      if (posts) {
        posts.forEach((post: Post) => {
          result.push(post);
        });
      }
      return result;
    })
    .subscribe(
      res => {
        this.setPageOffset(this.currentPage);
        this.posts = res;
      },
      err => {
        this.serverDown = true;
      },
      () => {
        this.loadingPosts = false;
      }
    );
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
      }, err => {
        let alert = new AlertNotification('There was a problem changing the status of your vote.', 'danger');
        this._alertService.addAlert(alert);
        this.sendingVote = null;
      }
    );
  }

  openFlagModal(post: Post) {
    let preset = flagContent(this.modal, post.title, (<any>post.user).username);
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
    let preset = deleteContent(this.modal, post.title, (<any>post.user).username);
    let dialog = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        res => {
          this._postService.deletePost(post).subscribe(
            res => {
              this.removePost(post);
              let alert = new AlertNotification('Successfully deleted post.', 'success');
              this._alertService.addAlert(alert);
            }, err => {
              console.log(err);
              let message = 'There was an error deleting that post.';
              let alert = new AlertNotification(message, 'danger')
              this._alertService.addAlert(alert);
            }, () => {

            }
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

  pageChanged(event) {
    this.currentPage = event.page;
    this.getPosts(this.currentPage, this.perPage, this.currentKind);
  }

  ngOnInit() {
    this.getPosts(this.currentPage, this.perPage, 'all');
  }
}
