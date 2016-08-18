import { Component, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HTTP_PROVIDERS, Http, Headers } from '@angular/http';
import { CORE_DIRECTIVES, NgModel } from '@angular/common';
import { FORM_DIRECTIVES } from '@angular/forms';

import { PagerComponent } from '../directives/pagination/pager.component';
import { DROPDOWN_DIRECTIVES } from '../directives/dropdown';
import { Pluralize } from '../directives/pluralize/pluralize';

import { PostService } from '../services/posts/postsService';
import { AuthService } from '../services/auth/authService';

import { Post } from '../datatypes/post/post';

import { TimeSincePipe } from '../pipes/timeSince.ts';

import { flagContent, deleteContent } from '../modal/modalPresets';

@Component({
  selector: 'posts',
  template: require('./posts.html'),
  directives: [ PagerComponent, CORE_DIRECTIVES, FORM_DIRECTIVES, RouterLink, DROPDOWN_DIRECTIVES, Pluralize, NgModel ],
  pipes: [ TimeSincePipe ],
  providers: [ PostService ],
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
  private flagModal;
  public mySampleElement: ElementRef;
  public lastModalResult: string;

  constructor(
    private _router: Router,
    private _postService: PostService,
    private _authService: AuthService
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

  /*openFlagModal(title: string, username: string) {
    let preset = flagContent(this.modal, title, username);
    let dialog: Promise<ModalDialogInstance> = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          // Send http call
          alert('woohoo')
        },
        () => console.log('error confirming modal')
      )
    });
  }

  openDeleteModal(title: string, username: string) {
    let preset = deleteContent(this.modal, title, username);
    let dialog: Promise<ModalDialogInstance> = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          // Send http call
          alert('woohoo')
        },
        () => console.log('error confirming modal')
      )
    });
  }*/

  ngOnInit() {
    this.getPosts(this.currentPage, this.perPage, 'all');
  }
}
