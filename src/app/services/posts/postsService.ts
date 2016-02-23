import {Http, Headers} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Post} from '../../datatypes/post/post';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PostService {
  constructor(private http: Http) { }
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
        posts.forEach((post: Post) => {
          result.push(post);
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
    .map(res => res.json());
  }
  addPost(post: any) {
    console.log(post)
    let token = localStorage.getItem('auth_token');
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', token);
    return this.http.post('http://localhost:3000/api/posts/', JSON.stringify(post), {
      headers: header
    })
    .map(res => res.json())
  }
}
