import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { Post } from '../datatypes/post/post';
import { Comment } from '../datatypes/comment/comment';
import { AlertNotification } from '../datatypes/alert/alertnotification';
import { flagCommentContent, deleteCommentContent } from '../modal/modalPresets';

import { Collapse } from '../directives/collapse/collapse';
import { DROPDOWN_DIRECTIVES } from '../directives/dropdown';
import { Pluralize } from '../directives/pluralize/pluralize';

import { AlertService } from '../services/alerts/alertsService';
import { AuthService } from '../services/auth/authService';
import { CommentService } from '../services/comments/commentService';
import { PostService } from '../services/posts/postsService';

import { TimeSincePipe } from '../pipes/timeSince.ts';
import { OrderBy } from '../pipes/orderBy';

@Component({
  selector: 'comment',
  directives: [ RouterLink, DROPDOWN_DIRECTIVES, Collapse, CommentDetail, Pluralize ],
  pipes: [ OrderBy, TimeSincePipe ],
  styles: [ require('./comment.scss') ],
  template: require('./comment.html')
})

export class CommentDetail {
  @Input() comment;
  @Input() replyOpen;
  @Output() deleteEvent = new EventEmitter();
  private isCollapsed: boolean = true;
  private replyCollapsed: boolean = true;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _commentService: CommentService,
    private _postService: PostService,
    private modal: Modal
    /*private _fb: FormBuilder,
    private modal: Modal*/
  ) {
    /*this.replyForm = _fb.group({
      'reply': ['', Validators.compose([
        Validators.required])]
    });
    this.reply = this.replyForm.controls['reply'];*/
  }

  /*cancelReply() {
    this.replyCollapsed = true;
    (<Control>this.replyForm.controls['reply']).updateValue('');
    (<Control>this.replyForm.controls['reply']).pristine = true;
  }*/

  /*addReply(body: string) {
    let commentableType = 'Comment';
    let commentableId = this.comment.id;
    this._commentService.addComment(body, commentableType, commentableId, this._authService.currentUser.id)
    .subscribe(
      res => {
        this.comment.comments.push(res);
        let alert = {
          message: 'Successfully added comment!',
          type: 'success',
          timeout: 8000,
          dismissible: true
        }
        this._alertService.addAlert(alert);
      },
      err => console.log(err),
      () => {
        this.isCollapsed = true;
        (this.replyForm.controls['reply'] as Control).updateValue('');
      }
    )
  }*/

  /*deletePostComment(commentableId: number) {
    this._commentService.deletePostComment(commentableId)
    .subscribe(
      res => {
        this.deleteEvent.emit('event');
      },
      err => console.log(err),
      () => {
      }
    )
  }*/

  /*indexComment(id: number) {
    if (this._commentService.selectedRoute.length === 1) {
      let index = this.comment.comments.indexOf()
      this.comment.comments.splice(index, 1)
    }
    this._commentService.selectedRoute.unshift(id);
    console.log('the current route is', this._commentService.selectedRoute);
    this.deleteEvent.emit('event');
  }*/

  openFlagModal(comment: any) {
    let preset = flagCommentContent(this.modal, comment);
    let dialog = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          this._commentService.flagComment(comment).subscribe(
            res => {
              // Reload comments
            }, err => {
              let message: string = 'There was an error flagging the post.';
              let alert = new AlertNotification(message, 'danger');
              this._alertService.addAlert(alert);
            }
          )
        }, () => {

        }
      )
    });
  }

  openDeleteModal(comment: any) {
    let preset = deleteCommentContent(this.modal);
    let dialog = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          this._commentService.deletePostComment(comment).subscribe(
            res => {
              // Reload comments
              let alert = new AlertNotification('Successfully deleted comment!', 'success');
              this._alertService.addAlert(alert);
              // Send deleteEvent to bubble up to postDetail
            }, err => {
              let message: string = 'There was an error flagging the post.';
              let alert = new AlertNotification(message, 'danger');
              this._alertService.addAlert(alert);
            }
          )
        }, () => {

        }
      )
    });
  }

  ngOnInit() {
  }
}
