import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP_PROVIDERS, Http, Headers } from '@angular/http';
import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { AlertService } from '../services/alerts/alertsService';
import { AuthService } from '../services/auth/authService';
import { PostService } from '../services/posts/postsService';

import { Post } from '../datatypes/post/post';
import { AlertNotification } from '../datatypes/alert/alertnotification';
import { guidelines, flagContent, deleteContent } from '../modal/modalPresets';

import { PrefixTitlePipe } from '../pipes/prefixTitle';

import { UrlValidator } from '../directives/urlValidator/url.validator';

@Component({
  selector: 'add-post',
  template: require('./addPost.html'),
  styles: [ require('./addPost.scss') ],
  directives: [
    FORM_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES,
    UrlValidator
  ],
  pipes: [ PrefixTitlePipe ]
})

export class AddPost {
  private addPostForm: FormGroup;
  private type: string = 'Post';
  private title: AbstractControl;
  private url: AbstractControl;
  private kind: AbstractControl;
  private body: AbstractControl;
  private bodyLabel: string;
  private processing: boolean;

  constructor(
    private _alertService: AlertService,
    private _authService: AuthService,
    private _postService: PostService,
    private _router: Router,
    private modal: Modal
  ) {
    this.addPostForm = new FormGroup({
      'title': new FormControl(''),
      'url': new FormControl(''),
      'kind': new FormControl(''),
      'body': new FormControl('')
    });
    this.title = this.addPostForm.find('title');
    this.url = this.addPostForm.find('url');
    this.kind = this.addPostForm.find('kind');
    this.body = this.addPostForm.find('body');
  }

  setType(type: string): void {
    this.type = type;
    if (type === 'Show DD') {
      this.bodyLabel = 'Summary';
    } else if (type === 'Ask DD') {
      this.bodyLabel = 'Prompt';
    } else if (type === 'Job') {
      this.bodyLabel = 'Description';
    }
  }

  generateTitle(title: string): string {
    if (this.type === 'Post') {
      return title;
    } else if (this.type === 'Show DD') {
      return 'Show DD: ' + title;
    } else if (this.type === 'Ask DD') {
      return 'Ask DD: ' + title;
    } else if (this.type === 'Job') {
      return 'Job: ' + title;
    }
  }

  addPost() {
    this.processing = true;
    let id = this._authService.currentUser.id;
    this._postService.addPost({
      title: this.generateTitle(this.title.value),
      url: this.url.value || null,
      kind: this.type.split(' ')[0].toLowerCase(),
      body: this.body.value || null,
      user_id: id
    })
    .subscribe(
      res => {
        let alert = new AlertNotification('Successfully posted!', 'success');
        this._alertService.addAlert(alert);
      },
      err => {
        console.log(err);
        let body = JSON.parse(err._body);
        let error = '';
        if (body['user']) {
          error = 'Your account has to be confirmed before creating a post.';
        } else if (body['title']) {
          error = 'There was an issue with the title of your post';
        } else if (body['url']) {
          error = 'There was an issue with the link of the post.';
        } else {
          error = 'There was an error adding your post.'
        }
        let alert = new AlertNotification(error, 'danger');
        this._alertService.addAlert(alert)
        this.processing = false;
      },
      () => {
        this.processing = false;
        this._router.navigate([ '/' ]);
      }
    );
  }

  openGuidelinesModal()  {
    let preset = guidelines(this.modal);
    let dialog = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        res => {},
        err => {}
      )
    })
  }

  /*openFlagModal(post: Post) {
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
  }*/

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
        () => {}
      )
    });
  }

  ngOnInit() {
    if (!this._authService.currentUser.confirmed) {
      let alert = new AlertNotification('You must first confirm your account before making posts. We\'ve sent you an email with a link to take care of this.');
      this._alertService.addAlert(alert);
    }
  }
}
