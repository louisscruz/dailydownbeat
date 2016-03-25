import {Component, OnInit} from 'angular2/core';
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
import {CommentDetail} from '../comment/comment';
import {AuthService} from '../services/auth/authService';
import {PostService} from '../services/posts/postsService';
import {CommentService} from '../services/comments/commentService';
import {Collapse} from '../directives/collapse/collapse';
import {OrderBy} from '../pipes/orderBy';

@Component({
  selector: 'post-detail',
  directives: [RouterLink, DROPDOWN_DIRECTIVES, Collapse, CommentDetail],
  pipes: [OrderBy],
  providers: [PostService, CommentService],
  styles: [ require('./post.scss') ],
  template: require('./post.html')
})

export class PostDetail implements OnInit {
  public isCollapsed: boolean = true;
  private post: Post;
  private comments: Array<any>;
  private commentForm: ControlGroup;
  private comment: AbstractControl;

  constructor(
    private _router: Router,
    private _routeParams: RouteParams,
    private _authService: AuthService,
    private _postsService: PostService,
    private _commentService: CommentService,
    private _fb: FormBuilder
  ) {
    this.commentForm = _fb.group({
      'comment': ['', Validators.compose([
        Validators.required])]
    });
    this.comment = this.commentForm.controls['password'];
  }
  
  onSelectUser(id: number) {
    this._router.navigate( ['UserDetail', { id: id }]);
  }

  ngOnInit() {
    let id = this._routeParams.get('id');
    this._postsService.getPost(id)
    .subscribe(
      res => this.post = res,
      err => console.log(err),
      () => console.log(this.post)
    );
    this._postsService.getPostComments(id)
    .subscribe(
      res => this.comments = res,
      err => console.log(err),
      () => console.log(this.comments)
    );
  }
}
