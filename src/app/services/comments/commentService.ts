import {Injectable} from 'angular2/core';

@Injectable()
export class CommentService {
  private replyOpen: number;
  constructor() {}
  toggleReplyOpen(id: number) {
    if (id === this.replyOpen) {
      this.replyOpen = null;
    } else {
      this.replyOpen = id;
    }
  }
}
