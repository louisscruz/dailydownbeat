import {Component, Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PostService} from '../services/posts/postsService';
import {Post} from '../datatypes/post/post';

@Component({
  selector: 'posts',
  template: require('./posts.html'),
  directives: [PAGINATION_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES],
  bindings: [PostService]
})

export class Posts {
  private posts: Array<Post>;
  private totalItems: number = 64;
  private currentPage: number = 1;
  private pageChanged(event: any): void {
    console.log(event);
  };
  constructor(public postService: PostService) {
    postService.getPosts()
    .subscribe(
      res => {
        this.posts = res;
      },
      err => console.log(err),
      () => console.log('retrieved posts')
    );
  }
}
