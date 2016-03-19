import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Router, RouteParams, RouterLink} from 'angular2/router';
import {DROPDOWN_DIRECTIVES} from '../directives/dropdown';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators,
  AbstractControl,
  Control
} from 'angular2/common';

import {Post} from '../datatypes/post/post';
import {Comment} from '../datatypes/comment/comment';
import {AuthService} from '../services/auth/authService';
import {CommentService} from '../services/comments/commentService';
import {Collapse} from '../directives/collapse/collapse';
import {Pluralize} from '../directives/pluralize/pluralize';

@Component({
  selector: 'comment',
  directives: [RouterLink, DROPDOWN_DIRECTIVES, Collapse, CommentDetail, Pluralize],
  styles: [ require('./comment.scss') ],
  template: require('./comment.html')
})

export class CommentDetail {
  @Input() comment;
  @Input() replyOpen;
  private isCollapsed: boolean = true;
  private replyCollapsed: boolean = true;
  private replyForm: ControlGroup;
  private reply: AbstractControl;
  constructor(
    private _authService: AuthService,
    private _commentService: CommentService,
    private _fb: FormBuilder
  ) {
    this.replyForm = _fb.group({
      'reply': ['', Validators.compose([
        Validators.required])]
    });
    this.reply = this.replyForm.controls['reply'];
  }
  /*toggleReplyOpen(id: number) {
    if (id === this.replyOpen) {
      this.replyOpen = null;
    } else {
      this.replyOpen = id;
    }
  }*/
  cancelReply() {
    this.replyCollapsed = true;
    (<Control>this.replyForm.controls['reply']).updateValue('');
    (<Control>this.replyForm.controls['reply']).pristine = true;
  }
}
