import {Component, OnInit} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {HTTP_PROVIDERS, Http, Headers} from 'angular2/http';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Pager} from '../directives/pagination/pager';
import {DROPDOWN_DIRECTIVES} from '../directives/dropdown';

import {PostService} from '../services/posts/postsService';
import {AuthService} from '../services/auth/authService';

import {Post} from '../datatypes/post/post';

import {TimeSincePipe} from '../pipes/timeSince.ts';

@Component({
  selector: 'posts',
  template: require('./posts.html'),
  directives: [Pager, CORE_DIRECTIVES, RouterLink, DROPDOWN_DIRECTIVES],
  pipes: [TimeSincePipe],
  providers: [HTTP_PROVIDERS, PostService],
  styles: [require('./posts.scss')]
})

export class Posts implements OnInit {
  private contentSelect: string = 'all';
  private posts: Array<Post>;
  private totalItems: number = 100;
  private currentPage: number = 1;
  private pageOffset: number = 0;
  private perPage: number = 30;
  private loadingPosts: boolean = false;
  private serverDown: boolean = false;

  constructor(
    private _router: Router,
    private _postService: PostService,
    private _authService: AuthService
  ) {}

  setContentSelect(content: string) {
    if (this.contentSelect !== content) {
      this.contentSelect = content;
    }
  }
  setPageOffset(currentPage) {
    this.pageOffset = ((this.currentPage - 1) * this.perPage);
  }
  getPosts(page, per_page) {
    this.loadingPosts = true;
    this._postService.getPosts(page, per_page)
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
  ngOnInit() {
    this.getPosts(this.currentPage, this.perPage);
  }
}
