import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
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
//import {Comment} from '../datatypes/comment/comment';
import {AlertService} from '../services/alerts/alertsService';
import {AuthService} from '../services/auth/authService';
import {CommentService} from '../services/comments/commentService';
import {Collapse} from '../directives/collapse/collapse';
import {Pluralize} from '../directives/pluralize/pluralize';
import {TimeSincePipe} from '../pipes/timeSince.ts';
import {OrderBy} from '../pipes/orderBy';


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
  selector: 'comment',
  directives: [RouterLink, DROPDOWN_DIRECTIVES, Collapse, CommentDetail, Pluralize],
  providers: [Modal],
  pipes: [OrderBy, TimeSincePipe],
  styles: [ require('./comment.scss') ],
  template: require('./comment.html')
})

export class CommentDetail implements OnInit {
  @Input() comment;
  @Input() replyOpen;
  @Output() deleteEvent = new EventEmitter();
  private isCollapsed: boolean = true;
  private replyCollapsed: boolean = true;
  private replyForm: ControlGroup;
  private reply: AbstractControl;
  constructor(
    private _alertService: AlertService,
    private _authService: AuthService,
    private _commentService: CommentService,
    private _fb: FormBuilder,
    private modal: Modal
  ) {
    this.replyForm = _fb.group({
      'reply': ['', Validators.compose([
        Validators.required])]
    });
    this.reply = this.replyForm.controls['reply'];
  }
  cancelReply() {
    this.replyCollapsed = true;
    (<Control>this.replyForm.controls['reply']).updateValue('');
    (<Control>this.replyForm.controls['reply']).pristine = true;
  }
  addReply(body: string) {
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
  }
  deletePostComment(commentableId: number) {
    this._commentService.deletePostComment(commentableId)
    .subscribe(
      res => {
        this.deleteEvent.emit('event');
      },
      err => console.log(err),
      () => {
      }
    )
  }
  indexComment(id: number) {
    if (this._commentService.selectedRoute.length === 1) {
      let index = this.comment.comments.indexOf()
      this.comment.comments.splice(index, 1)
    }
    this._commentService.selectedRoute.unshift(id);
    console.log('the current route is', this._commentService.selectedRoute);
    this.deleteEvent.emit('event');
  }
  openFlagModal(title: string, username: string, id: number) {
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

  openDeleteModal(title: string, username: string, id: number) {
    let preset = deleteContent(this.modal, title, username);
    let dialog: Promise<ModalDialogInstance> = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          this.indexComment(id);
        },
        () => console.log('error confirming modal')
      )
    });
  }
  ngOnInit() {
    this.isCollapsed = true;
  }
}
