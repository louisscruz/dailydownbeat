import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

@Injectable()
export class CommentService {
  private apiUrl: string = API_URL;
  private replyOpen: number;
  constructor(private http: Http) {}

  toggleReplyOpen(id: number) {
    if (id === this.replyOpen) {
      this.replyOpen = null;
    } else {
      this.replyOpen = id;
    }
  }

  addComment(body: string, commentableType: string, commentableId: number, userId: number) {
    let token = localStorage.getItem('auth_token');
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', token);
    let comment = {
      body: body,
      commentable_type: commentableType,
      commentable_id: commentableId,
      user_id: userId
    }
    return this.http.post(this.apiUrl + '/api/comments/', JSON.stringify(comment), {
      headers: header
    })
    .map(res => res.json());
  }
  
  deletePostComment(commentableId: number) {
    let token = localStorage.getItem('auth_token');
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', token);
    return this.http.delete(this.apiUrl + '/api/comments/' + commentableId, {
      headers: header
    })
    .map(res => res.json());
  }
}
