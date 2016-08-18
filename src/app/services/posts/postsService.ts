import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Post} from '../../datatypes/post/post';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PostService {
  private apiUrl: string = API_URL;

  constructor(private http: Http) {}

  getPosts(page, per_page, kind): any {
    let jwt = localStorage.getItem('auth_token');
    let authHeader = new Headers();
    if (jwt) {
      authHeader.append('Authorization', jwt);
    }
    let request: string = this.apiUrl + '/api/posts?page=' + page + '&per_page=' + per_page;
    if (kind !== 'all') {
      request += '&kind=' + kind;
    }
    return this.http.get(request, {
      headers: authHeader
    })
  }

  getPost(id: number | string) {
    return this.http.get(this.apiUrl + '/api/posts/' + id)
    .map(res => res.json());
  }

  getPostComments(id: number | string) {
    return this.http.get(this.apiUrl + '/api/posts/' + id + '/comments')
    .map(res => res.json());
  }

  addPost(post: any) {
    let token = localStorage.getItem('auth_token');
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', token);
    return this.http.post(this.apiUrl + '/api/posts/', JSON.stringify(post), {
      headers: header
    })
    .map(res => res.json());
  }

  vote(polarity: number) {
    alert(polarity);
  }

  addVote() {}

  editVote() {}

  deleteVote() {}
}
