import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Post } from '../../datatypes/post/post';

@Injectable()
export class PostService {
  private apiUrl: string = API_URL;

  constructor(private http: Http) {}

  getToken(): string {
    return localStorage.getItem('auth_token');
  }

  generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getToken());
    console.log(headers);
    return headers;
  }

  getPosts(page, per_page, kind): any {
    let jwt = this.getToken();
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
    return this.http.post(this.apiUrl + '/api/posts/', JSON.stringify(post), {
      headers: this.generateHeaders()
    })
    .map(res => res.json());
  }

  deletePost(post: Post) {
    return this.http.delete(this.apiUrl + '/api/posts/' + post.id, {
      headers: this.generateHeaders()
    });
  }

  flagPost(post: Post) {
    return this.http.post(this.apiUrl + '/api/posts/' + post.id + '/flag', {
      headers: this.generateHeaders()
    })
    .map(res => res.json());
  }

  vote(post: Post, polarity: number) {
    return this.http.post(this.apiUrl + '/api/posts/' + post.id + '/upvote', {}, {
      headers: this.generateHeaders()
    })
    .map(res => res.json());
  }

  upvote(post: Post) {
    return this.http.post(this.apiUrl + '/api/posts/' + post.id + '/upvote', {}, {
      headers: this.generateHeaders()
    })
    .map(res => res.json());
  }

  downvote(post: Post) {
    return this.http.post(this.apiUrl + '/api/posts/' + post.id + '/downvote', {}, {
      headers: this.generateHeaders()
    })
    .map(res => res.json());
  }

  unvote(post: Post) {
    return this.http.post(this.apiUrl + '/api/posts/' + post.id + '/unvote', {}, {
      headers: this.generateHeaders()
    });
  }
}
