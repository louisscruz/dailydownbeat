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
  private commentEditForm: FormGroup;
  private body: AbstractControl;
  private replyForm: FormGroup;
  private reply: AbstractControl;
  private isCollapsed: boolean = true;
  private replyCollapsed: boolean = true;
  private replySending: boolean = false;
  private sendingVote: number = null;
  private editing: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _commentService: CommentService,
    private _postService: PostService,
    private cd: ChangeDetectorRef,
    private modal: Modal
  ) {
    this.commentEditForm = new FormGroup({
      body: new FormControl()
    });
    this.body = this.commentEditForm.find('body');

    this.replyForm = new FormGroup({
      reply: new FormControl()
    });
    this.reply = this.replyForm.find('reply');
  }

  closeReplyForm(): void {
    this._commentService.toggleReplyOpen(this.comment.id);
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
    );
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
          );
        }, () => {

        }
      );
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
          );
        }, () => {

        }
      );
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

  handleUpvote(comment: Comment) {
    return comment.upvoted ? this.unvote(comment, 1) : this.upvote(comment);
  }

  handleDownvote(comment: Comment) {
    return comment.downvoted ? this.unvote(comment, -1) : this.downvote(comment);
  }

  upvote(comment: Comment) {
    this.sendingVote = comment.id;
    this._commentService.upvote(comment).subscribe(
      res => {
        let alert = new AlertNotification('Successfully upvoted comment!', 'success', 3000);
        this._alertService.addAlert(alert);
        comment.downvoted ? comment.points += 2 : comment.points++;
        comment.upvoted = true;
        comment.downvoted = false;
        this.sendingVote = null;
      }, err => {
        console.log(err);
        let alert = new AlertNotification('There was a problem sending your vote.', 'danger');
        let body = JSON.parse(err._body);
        if (body['user'] && body['user'][0] === 'must be confirmed to make posts.') {
          alert.message = 'You must first confirm your account before voting. We sent you an email to handle this when you created your account.';
        } else if (err.status === 401) {
          alert.message = 'You have to be logged in to vote.';
          alert.type = 'warning';
        }
        this._alertService.addAlert(alert);
        this.sendingVote = null;
      }
    );
  }

  downvote(comment: Comment) {
    this.sendingVote = comment.id;
    this._commentService.downvote(comment).subscribe(
      res => {
        let alert = new AlertNotification('Successfully downvoted comment!', 'success', 3000);
        this._alertService.addAlert(alert);
        comment.upvoted ? comment.points -= 2 : comment.points--;
        comment.downvoted = true;
        comment.upvoted = false;
        this.sendingVote = null;
      }, err => {
        console.log(err);
        let alert = new AlertNotification('There was a problem sending your vote.', 'danger');
        let body = JSON.parse(err._body);
        if (body['user'] && body['user'][0] === 'must be confirmed to make posts.') {
          alert.message = 'You must first confirm your account before voting. We sent you an email to handle this when you created your account.';
        } else if (err.status === 401) {
          alert.message = 'You have to be logged in to vote.';
          alert.type = 'warning';
        }
        this._alertService.addAlert(alert);
        this.sendingVote = null;
      }
    );
  }

  unvote(comment: Comment, polarity: number) {
    this.sendingVote = comment.id;
    this._commentService.unvote(comment).subscribe(
      res => {
        let alert = new AlertNotification('Vote successfully updated!', 'success', 3000);
        this._alertService.addAlert(alert);
        comment.points -= polarity;
        comment.upvoted = false;
        comment.downvoted = false;
        this.sendingVote = null;
      }, err => {
        let alert = new AlertNotification('There was a problem changing the status of your vote.', 'danger');
        this._alertService.addAlert(alert);
        this.sendingVote = null;
      }
    );
  }

  toggleEdit(): void {
    if (!this.editing) {
      (<FormControl>this.body).updateValue(this.comment.body);
    }
    this.editing = !this.editing;
  }

  updateComment() {
    let comment = {
      id: this.comment.id,
      body: this.body.value
    };
    this._commentService.updateComment(comment).subscribe(
      res => {
        this.comment = res;
        this.editing = false;
        let alert = new AlertNotification('Comment successfully updated!', 'success', 3000);
        this._alertService.addAlert(alert);
      }, err => {
        this.editing = false;
        let alert = new AlertNotification('There was an error updating that comment.', 'danger');
        this._alertService.addAlert(alert);
      }
    );
  }
}
