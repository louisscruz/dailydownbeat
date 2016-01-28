import {Http, Headers} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Post} from '../../datatypes/post/post';

@Injectable()
export class PostService {
  constructor(public http: Http) {
    console.log('Service Created!', http);
  }
  getPosts(page, per_page) {
    var jwt = localStorage.getItem('auth_token');
    var authHeader = new Headers();
    if (jwt) {
      authHeader.append('Authorization', jwt);
    }
    return this.http.get('http://localhost:3000/api/posts?page=' + page + '&per_page=' + per_page, {
      headers: authHeader
    })
    .map(res => {
      console.log(res.headers);
      return res;
    })
    .map(res => res.json())
    .map((posts: Array<any>) => {
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
