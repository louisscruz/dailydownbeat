import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { DROPDOWN_DIRECTIVES } from '../directives/dropdown';
import { Collapse } from '../directives/collapse/collapse';

import { Post } from '../datatypes/post/post';
import { AlertNotification } from '../datatypes/alert/alertnotification';
import { Comment } from '../datatypes/comment/comment';
import { CommentDetail } from '../comment';
import { flagContent, deleteContent } from '../modal/modalPresets';

import { AlertService } from '../services/alerts/alertsService';
import { AuthService } from '../services/auth/authService';
import { CommentService } from '../services/comments/commentService';
import { PostService } from '../services/posts/postsService';

import { OrderBy } from '../pipes/orderBy';
import { TimeSincePipe } from '../pipes/timeSince';

@Component({
  selector: 'post-detail',
  directives: [ RouterLink, DROPDOWN_DIRECTIVES, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, Collapse, CommentDetail ],
  pipes: [ OrderBy, TimeSincePipe ],
  providers: [ CommentService ],
  styles: [ require('./post.scss') ],
  template: require('./post.html')
})

export class PostDetail {
  private addCommentForm: FormGroup;
  public isCollapsed: boolean = true;
  private post: Post;
  private comment: AbstractControl;
  private comments: Array<any>;
  private loadingComments: boolean = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _postService: PostService,
    private _commentService: CommentService,
    private modal: Modal
  ) {
    this.addCommentForm = new FormGroup({
      comment: new FormControl()
    });
    this.comment = this.addCommentForm.find('comment');
  }

  onSelectUser(id: number) {
    this._router.navigate( ['UserDetail', { id: id }]);
  }

  closeCommentForm(): void {
    this.isCollapsed = true;
    (<FormControl>this.addCommentForm.find('comment')).updateValue('');
  }

  addComment(body: string, commentableType: string, commentableId: number) {
    this._commentService.addComment(body, commentableType, commentableId, this._authService.currentUser.id)
    .subscribe(
      res => {
        this.insertComment(res);
        let alert = new AlertNotification('Successfully added your comment!', 'success');
        this._alertService.addAlert(alert);
      },
      err => console.log(err),
      () => {
        this.isCollapsed = true;
        (<FormControl>this.addCommentForm.find('comment')).updateValue('');
      }
    )
  }

  insertComment(comment: Comment): void {
    let minimumIndex: number = 0;
    let maximumIndex: number = this.comments.length - 1;
    let currentIndex: number;

    while (maximumIndex > minimumIndex) {
      currentIndex = (minimumIndex + maximumIndex) / 2 | 0;

      if (this.comments[currentIndex].id < comment.id) {
        maximumIndex = currentIndex - 1;
      } else {
        minimumIndex = currentIndex + 1;
      }
    }

    this.comments.splice(currentIndex, 0, comment);
  }

  removeComment(comment): void {
    // Binary Search: This assumes that the comments are in descending order by ID
    let minimumIndex: number = 0;
    let maximumIndex: number = this.comments.length - 1;

    while (maximumIndex > minimumIndex) {
      let currentIndex = (minimumIndex + maximumIndex) / 2 | 0;

      if (this.comments[currentIndex].id < comment.id) {
        maximumIndex = currentIndex - 1;
      } else if (this.comments[currentIndex].id > comment.id) {
        minimumIndex = currentIndex + 1;
      } else {
        this.comments.splice(currentIndex, 1);
      }
    }
  }

  openFlagModal(post: Post) {
    let preset = flagContent(this.modal, post.title, (<any>post.user).username);
    let dialog = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          this._postService.flagPost(post).subscribe(
            res => {
              // Reload posts
            }, err => {
              let message: string = 'There was an error flagging the post.';
              let alert = new AlertNotification(message, 'danger');
              this._alertService.addAlert(alert);
            }
          )
        }, () => console.log('error confirming modal')
      )
    });
  }

  openDeleteModal(post: Post) {
    let preset = deleteContent(this.modal, post.title, (<any>post.user).username);
    let dialog = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          this._postService.deletePost(post).subscribe(
            res => {
              alert('success');
              // Reload posts
            }, err => {
              let message = 'There was an error deleting that post.';
              let alert = new AlertNotification(message, 'danger')
              this._alertService.addAlert(alert);
            }, () => {

            }
          )
        },
        () => console.log('error confirming modal')
      )
    });
  }

  ngOnInit() {
    this.loadingComments = true;
    this._activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      this._postService.getPost(id)
      .subscribe(
        res => this.post = res,
        err => console.log(err),
        () => {}
      );
      this._postService.getPostComments(id)
      .subscribe(
        res => this.comments = res,
        err => console.log(err),
        () => {
          this.loadingComments = false;
        }
      );
    });
  }
}
