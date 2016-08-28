import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  FormControl,
  AbstractControl
} from '@angular/forms';
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
  directives: [
    RouterLink,
    DROPDOWN_DIRECTIVES,
    FORM_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES,
    Collapse,
    CommentDetail,
    Pluralize
  ],
  pipes: [ OrderBy, TimeSincePipe ],
  styles: [ require('./comment.scss') ],
  template: require('./comment.html')
})

export class CommentDetail {
  @Input() comment;
  @Input() replyOpen;
  @Output() deleteEvent = new EventEmitter();
  private replyForm: FormGroup;
  private reply: AbstractControl;
  private isCollapsed: boolean = true;
  private replyCollapsed: boolean = true;
  private replySending: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _commentService: CommentService,
    private _postService: PostService,
    private cd: ChangeDetectorRef,
    private modal: Modal
  ) {
    this.replyForm = new FormGroup({
      reply: new FormControl()
    });
    this.reply = this.replyForm.find('reply');
  }

  closeReplyForm(): void {
    this._commentService.toggleReplyOpen(this.comment.id)
  }

  resetReplyForm(): void {
    (<FormControl>this.replyForm.find('reply')).updateValue('');
  }

  addReply(body: string): void {
    let commentableType = 'Comment';
    let commentableId = this.comment.id;
    this.replySending = true;
    this._commentService.addComment(body, commentableType, commentableId, this._authService.currentUser.id)
    .subscribe(
      res => {
        this.insertComment(res);
        // Perform binary insert based on id value
        !!this.comment.comment_count ? this.comment.comment_count++ : this.comment.comment_count = 1;
        this.resetReplyForm();
        this.closeReplyForm();
        let alert = new AlertNotification('Successfully added comment!', 'success');
        this._alertService.addAlert(alert);
      }, err => {
        let alert = new AlertNotification('There was an error adding that comment.', 'danger');
        this._alertService.addAlert(alert);
      }, () => {
        this.replySending = false;
      }
    )
  }

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
              this.deleteEvent.emit(comment);
              let alert = new AlertNotification('Successfully deleted comment!', 'success');
              this._alertService.addAlert(alert);
            }, err => {
              let message: string = 'There was an error deleting the post.';
              let alert = new AlertNotification(message, 'danger');
              this._alertService.addAlert(alert);
            }
          )
        }, () => {

        }
      )
    });
  }

  insertComment(comment: Comment): void {
    let minimumIndex: number = 0;
    let maximumIndex: number = this.comment.comments.length - 1;
    let currentIndex: number;

    while (maximumIndex > minimumIndex) {
      currentIndex = (minimumIndex + maximumIndex) / 2 | 0;

      if (this.comment.comments[currentIndex].id < comment.id) {
        maximumIndex = currentIndex - 1;
      } else {
        minimumIndex = currentIndex + 1;
      }
    }

    this.comment.comments.splice(currentIndex, 0, comment);
  }

  removeComment(comment): void {
    let minimumIndex: number = 0;
    let maximumIndex: number = this.comment.comments.length - 1;

    while (maximumIndex >= minimumIndex) {
      let currentIndex = (minimumIndex + maximumIndex) / 2 | 0;

      if (this.comment.comments[currentIndex].id < comment.id) {
        maximumIndex = currentIndex - 1;
      } else if (this.comment.comments[currentIndex].id > comment.id) {
        minimumIndex = currentIndex + 1;
      } else {
        this.comment.comments.splice(currentIndex, 1);
        this.comment.comment_count--;
      }
    }
  }
}
