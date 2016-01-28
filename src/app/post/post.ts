import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {Post} from '../datatypes/post/post';
import {PostService} from '../services/posts/postsService';

@Component({
  selector: 'post',
  template: require('./post.html'),
  providers: [PostService]
})

export class PostDetail implements OnInit{
  private post: Post;

  constructor(
    private _router: Router,
    private _routeParams: RouteParams,
    private _postsService: PostService) { }

  ngOnInit() {
    let id = this._routeParams.get('id');
    this._postsService.getPost(id)
    .subscribe(
      res => this.post = res,
      err => console.log(err),
      () => console.log(this.post)
    );
  }
}
