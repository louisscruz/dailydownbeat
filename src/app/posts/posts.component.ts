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

  vote(polarity: number) {
    this._postService.vote(polarity);
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
        (res) => {
          this._postService.deletePost(post).subscribe(
            res => {
              alert('success');
              // Reload posts
            }, err => {
              console.log(err);
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

  pageChanged(event) {
    this.currentPage = event.page;
    this.getPosts(this.currentPage, this.perPage, this.currentKind);
  }

  ngOnInit() {
    this.getPosts(this.currentPage, this.perPage, 'all');
  }
}
