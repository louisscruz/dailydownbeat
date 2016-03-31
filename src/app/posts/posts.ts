import {Component, OnInit} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {HTTP_PROVIDERS, Http, Headers} from 'angular2/http';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Pager} from '../directives/pagination/pager';
import {DROPDOWN_DIRECTIVES} from '../directives/dropdown';
import {Pluralize} from '../directives/pluralize/pluralize';

import {PostService} from '../services/posts/postsService';
import {AuthService} from '../services/auth/authService';
import {ModalService} from '../services/modal/modalService';

import {Post} from '../datatypes/post/post';
import {Modal} from '../datatypes/modal/modal';

import {TimeSincePipe} from '../pipes/timeSince.ts';

@Component({
  selector: 'posts',
  template: require('./posts.html'),
  directives: [Pager, CORE_DIRECTIVES, RouterLink, DROPDOWN_DIRECTIVES, Pluralize],
  pipes: [TimeSincePipe],
  providers: [HTTP_PROVIDERS, PostService],
  styles: [require('./posts.scss')]
})

export class Posts implements OnInit {
  private currentKind: string = 'all';
  private posts: Array<Post>;
  private totalItems: number = 100;
  private currentPage: number = 1;
  private pageOffset: number = 0;
  private perPage: number = 30;
  private loadingPosts: boolean = false;
  private serverDown: boolean = false;
  private flagModal: Modal;

  constructor(
    private _router: Router,
    private _postService: PostService,
    private _authService: AuthService,
    private _modalService: ModalService
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
    .subscribe(
      res => {
        this.setPageOffset(this.currentPage);
        this.posts = res;
      },
      err => {
        this.serverDown = true;
        console.log(err);
      },
      () => {
        this.loadingPosts = false;
        console.log('finished')
      }
    );
  }
  vote(polarity: number) {
    this._postService.vote(polarity);
  }
  //setFlagModal(title: string) {
    //this.flagModal = {
      //title: 'Are you sure?',
      //body: 'Are you sure that you would like to flag ' + title + ' ?',
      //confirmText: 'Flag',
      //type: 'warning'
    //}
  //}
  openFlagModal(post): void {
    let modal = {
      title: 'Are you sure?',
      body: 'You may only flag posts that break the terms and conditions.<br><br>Are you sure that you would like to flag <b>' + post.title + '</b> by <b>' + post.user.username + '</b>?',
      confirmText: 'Flag',
      type: 'warning'
    }
    this._modalService.setAndOpenModal(modal);
  }
  ngOnInit() {
    this.getPosts(this.currentPage, this.perPage);
  }
}
