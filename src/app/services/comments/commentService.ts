import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Comment } from '../../datatypes/comment/comment';

@Injectable()
export class CommentService {
  private apiUrl: string = API_URL;
  private replyOpen: number;
  public selectedRoute: any = [];
  constructor(private http: Http) {}

  toggleReplyOpen(id: number) {
    if (id === this.replyOpen) {
      this.replyOpen = null;
    } else {
      this.replyOpen = id;
    }
  }

  getToken(): string {
    return localStorage.getItem('auth_token');
  }

  generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getToken());
    return headers;
  }

  addComment(body: string, commentableType: string, commentableId: number, userId: number) {
    let comment = {
      body: body,
      commentable_type: commentableType,
      commentable_id: commentableId,
      user_id: userId
    }
    return this.http.post(this.apiUrl + '/api/comments/', JSON.stringify(comment), {
      headers: this.generateHeaders()
    })
    .map(res => res.json());
  }

  deletePostComment(comment: Comment) {
    return this.http.delete(this.apiUrl + '/api/comments/' + comment.id, {
      headers: this.generateHeaders()
    })
    .map(res => res.json());
  }

  flagComment(comment: Comment) {
    return this.http.post(this.apiUrl + '/api/comments/' + comment.id + '/flag', {
      headers: this.generateHeaders()
    })
    .map(res => res.json());
  }

  upvote(comment: Comment) {
    return this.http.post(this.apiUrl + '/api/posts/' + comment.id + '/upvote', {}, {
      headers: this.generateHeaders()
    })
    .map(res => res.json());
  }

  downvote(comment: Comment) {
    return this.http.post(this.apiUrl + '/api/posts/' + comment.id + '/downvote', {}, {
      headers: this.generateHeaders()
    })
    .map(res => res.json());
  }

  unvote(comment: Comment) {
    return this.http.post(this.apiUrl + '/api/posts/' + comment.id + '/unvote', {}, {
      headers: this.generateHeaders()
    });
  }
}
