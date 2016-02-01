import {Http, Headers} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Post} from '../../datatypes/post/post';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PostService {
  constructor(private http: Http) {
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
    .map(res => res.json())
    .map((posts: Array<any>) => {
      let result: Array<Post> = [];
      if (posts) {
        posts.forEach((post) => {
          result.push(
            new Post(
              post.id,
              post.title,
              post.url,
              post.created_at,
              post.user,
              post.comments,
              post.vote_count
            )
          );
        });
      }
      return result;
    });
  }
  getPost(id: number | string) {
    return this.http.get('http://localhost:3000/api/posts/' + id)
    .map(res => <Post> res.json());
  }
  getPostComments(id: number | string) {
    return this.http.get('http://localhost:3000/api/posts/' + id + '/comments')
    .map(res => res.json())
  }
}
