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

import { AlertService } from '../services/alerts/alertsService';
import { AuthService } from '../services/auth/authService';
import { PostService } from '../services/posts/postsService';

import { Post } from '../datatypes/post/post';
import { AlertNotification } from '../datatypes/alert/alertnotification';

import { PrefixTitlePipe } from '../pipes/prefixTitle';

import { UrlValidator } from '../directives/urlValidator/url.validator';

@Component({
  selector: 'add-post',
  template: require('./addPost.html'),
  directives: [ FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, UrlValidator ],
  pipes: [ PrefixTitlePipe ],
  providers: [ PostService ]
})

export class AddPost {
  private addPostForm: FormGroup;
  private type: string = 'Post';
  private title: AbstractControl;
  private url: AbstractControl;

  constructor(
    private _alertService: AlertService,
    private _authService: AuthService,
    private _postService: PostService,
    private _router: Router
  ) {
    /*function urlValidator(control: Control): { [s: string]: boolean } {
      let regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (control.value.length > 0 && !control.value.match(regex)) {
        return {invalidUrl: true};
      }
    }*/
    this.addPostForm = new FormGroup({
      'title': new FormControl(''),
      'url': new FormControl('')
    });
    this.title = this.addPostForm.controls['title'];
    this.url = this.addPostForm.controls['url'];
  }

  addPost() {
    let id = this._authService.currentUser.id;
    console.log(id);
    this._postService.addPost({
      title: this.title.value,
      url: this.url.value,
      user_id: id
    })
    .subscribe(
      res => {
        let alert = new AlertNotification('Successfully posted!', 'success');
        this._alertService.addAlert(alert);
      },
      err => {
        console.log(err);
        let error = 'There was an error adding your post.';
        /*let body = JSON.parse(JSON.stringify(err._body));
        console.log(body)
        console.log(body['title'])
        let error = '';
        if (body.url !== undefined) {
          error = 'There was an error adding the url of your post.';
        } else if (body.title !== undefined) {
          error = 'There was an error adding the title of your post.'
        } else {
          error = 'There was an error adding your post.'
        }*/
        let alert = new AlertNotification(error, 'danger');
        this._alertService.addAlert(alert)
      },
      () => {
        this._router.navigate([ '/' ]);
      }
    );
  }

  ngOnInit() {

  }
}
