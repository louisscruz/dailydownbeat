import {Http, Headers} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Post} from '../../datatypes/post/post';

@Injectable()
export class PostService {
  constructor(public http: Http) {
    console.log('Service Created!', http);
  }
  getPosts() {
    var jwt = localStorage.getItem('auth_token');
    var authHeader = new Headers();
    if (jwt) {
      authHeader.append('Authorization', jwt)
    }
    console.log(authHeader);
    return this.http.get('http://localhost:3000/posts', {
      headers: authHeader
    })
    .map(res => res.json())
    .map((posts: Array<any>) => {
      console.log(posts)
      let result: Array<Post> = [];
      if (posts) {
        posts.forEach((post) => {
          result.push(
            new Post(
              post.title,
              post.url
            )
          );
        });
      }
      return result;
    });
  }
}
