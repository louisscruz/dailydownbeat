import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {Post} from '../datatypes/post/post';
import {PostService} from '../services/posts/postsService';

@Component({
  selector: 'postDetail',
  template: require('./post.html'),
  providers: [PostService]
})

export class PostDetail implements OnInit{
  private post: Post;
  private comments: Array<any>;

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
    this._postsService.getPostComments(id)
    .subscribe(
      res => this.comments = res,
      err => console.log(err),
      () => console.log(this.comments)
    )
  }
}
