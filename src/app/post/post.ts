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
import {TimeSincePipe} from '../pipes/timeSince.ts';

import {
  ModalDialogInstance,
  ModalConfig,
  Modal,
  ICustomModal,
  YesNoModalContent,
  YesNoModal
} from 'angular2-modal/angular2-modal';
import {flagContent, deleteContent} from '../modal/modalPresets';

@Component({
  selector: 'post-detail',
  directives: [RouterLink, DROPDOWN_DIRECTIVES, Collapse, CommentDetail],
  pipes: [OrderBy, TimeSincePipe],
  providers: [PostService, CommentService, Modal],
  styles: [ require('./post.scss') ],
  template: require('./post.html')
})

export class PostDetail implements OnInit {
  public isCollapsed: boolean = true;
  private post: Post;
  private comments: Array<any>;
  private commentForm: ControlGroup;
  private comment: AbstractControl;

  private loadingComments: boolean = false;

  constructor(
    private _router: Router,
    private _routeParams: RouteParams,
    private _authService: AuthService,
    private _postsService: PostService,
    private _commentService: CommentService,
    private _fb: FormBuilder,
    private modal: Modal
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

  addComment(body: string, commentableType: string, commentableId: number) {
    this._commentService.addComment(body, commentableType, commentableId, this._authService.currentUser.id)
    .subscribe(
      res => {
        this.comments.push(res);
      },
      err => console.log(err),
      () => {
        this.isCollapsed = true;
        (this.commentForm.controls['comment'] as Control).updateValue('');
      }
    )
  }

  removeComment(id: number) {
    /*alert(this._commentService.selectedRoute)
    let route = this._commentService.selectedRoute;
    let filtered = this.comments;
    for (var i = 0; i < route.length; i++) {
      console.log(filtered[filtered.indexOf(route[i])])
    }*/

  }

  openFlagModal(title: string, username: string) {
    let preset = flagContent(this.modal, title, username);
    let dialog: Promise<ModalDialogInstance> = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          // Send http call
          alert('woohoo')
        },
        () => console.log('error confirming modal')
      )
    });
  }

  openDeleteModal(title: string, username: string) {
    let preset = deleteContent(this.modal, title, username);
    let dialog: Promise<ModalDialogInstance> = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          // Send http call
          alert('woohoo')
        },
        () => console.log('error confirming modal')
      )
    });
  }

  ngOnInit() {
    let id = this._routeParams.get('id');
    this.loadingComments = true;
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
      () => {
        console.log(this.comments);
        this.loadingComments = false;
      }
    );
  }
}
