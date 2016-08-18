import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DROPDOWN_DIRECTIVES } from '../directives/dropdown';
/*import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators,
  AbstractControl,
  Control
} from '@angular/common';*/

import { Post } from '../datatypes/post/post';
import { CommentDetail } from '../comment';
import { AlertService } from '../services/alerts/alertsService';
import { AuthService } from '../services/auth/authService';
import { PostService } from '../services/posts/postsService';
import { CommentService } from '../services/comments/commentService';
import { Collapse } from '../directives/collapse/collapse';
import { OrderBy } from '../pipes/orderBy';
import { TimeSincePipe } from '../pipes/timeSince';

/*import {
  ModalDialogInstance,
  ModalConfig,
  Modal,
  ICustomModal,
  YesNoModalContent,
  YesNoModal
} from 'angular2-modal/angular2-modal';*/
import {flagContent, deleteContent} from '../modal/modalPresets';

@Component({
  selector: 'post-detail',
  directives: [ RouterLink, DROPDOWN_DIRECTIVES, Collapse, CommentDetail ],
  pipes: [ OrderBy, TimeSincePipe ],
  providers: [ PostService, CommentService, AlertService ],
  styles: [ require('./post.scss') ],
  template: require('./post.html')
})

export class PostDetail {
  public isCollapsed: boolean = true;
  private post: Post;
  private comments: Array<any>;
  /*private commentForm: ControlGroup;
  private comment: AbstractControl;*/

  private loadingComments: boolean = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _postsService: PostService,
    private _commentService: CommentService,
    /*private _fb: FormBuilder,
    private modal: Modal*/
  ) {
    /*this.commentForm = _fb.group({
      'comment': ['', Validators.compose([
        Validators.required])]
    });
    this.comment = this.commentForm.controls['password'];*/
  }

  onSelectUser(id: number) {
    this._router.navigate( ['UserDetail', { id: id }]);
  }

  addComment(body: string, commentableType: string, commentableId: number) {
    this._commentService.addComment(body, commentableType, commentableId, this._authService.currentUser.id)
    .subscribe(
      res => {
        this.comments.push(res);
        let alert = {
          message: 'Successfully added comment!',
          type: 'success',
          timeout: 80000,
          dismissible: true
        }
        this._alertService.addAlert(alert);
      },
      err => console.log(err),
      () => {
        this.isCollapsed = true;
        /*(this.commentForm.controls['comment'] as Control).updateValue('');*/
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

  /*openFlagModal(title: string, username: string) {
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
  }*/

  /*openDeleteModal(title: string, username: string) {
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
  }*/

  ngOnInit() {
    this.loadingComments = true;
    this._activatedRoute.params.subscribe(params => {
      let id = +params['id'];
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
    });
  }
}
