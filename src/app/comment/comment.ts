import {Component, Input} from 'angular2/core';
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
import {PostService} from '../services/posts/postsService';
import {Collapse} from '../directives/collapse/collapse';

@Component({
  selector: 'comment',
  directives: [RouterLink, DROPDOWN_DIRECTIVES, Collapse, CommentDetail],
  //providers: [PostService],
  styles: [ require('./comment.scss') ],
  template: require('./comment.html')
})

export class CommentDetail {
  @Input() comment;
  private isCollapsed: boolean = true;
  constructor(private _authService: AuthService) {}
}
