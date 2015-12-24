import {Component, Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {PostService} from '../services/posts/postsService';
import {Post} from '../datatypes/post/post';

@Component({
  selector: 'posts',
  template: require('./posts.html'),
  bindings: [PostService]
})

export class Posts {
  /*posts = [
    new Post('This is a title', 53),
    new Post('Another title', 44)
  ];*/
  posts: Array<Post>;
  constructor(public postService: PostService) {
    postService.getPosts().subscribe(res => this.posts = res);
  }
  /*constructor(public http: Http) {
    function getPosts() {
      this.http.get('http://localhost:3000/posts')
        .map(res => res.text())
        .subscribe(
          data => this.post = data,
          err => this.logError(err),
          () => console.log('Post get complete')
        );
    }

    function logError(err) {
      console.error('There was an error: ' + err)
    }
  };*/

}
