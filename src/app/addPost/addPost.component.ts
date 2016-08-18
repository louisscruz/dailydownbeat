import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HTTP_PROVIDERS, Http, Headers} from '@angular/http';
import {CORE_DIRECTIVES,
        FORM_DIRECTIVES,
        FormBuilder,
        ControlGroup,
        Validators,
        AbstractControl,
        Control} from '@angular/common';
//import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';

import {AlertService} from '../services/alerts/alertsService';
import {AuthService} from '../services/auth/authService';
import {PostService} from '../services/posts/postsService';

import {Post} from '../datatypes/post/post';

import {PrefixTitlePipe} from '../pipes/prefixTitle';

@Component({
  selector: 'add-post',
  template: require('./addPost.html'),
  directives: [FORM_DIRECTIVES],
  pipes: [PrefixTitlePipe],
  providers: [PostService]
})

export class AddPost implements OnInit {
  private addPostForm: ControlGroup;
  private type: string = 'Post';
  private title: AbstractControl;
  private url: AbstractControl;

  constructor(
    private _fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _postService: PostService,
    private _router: Router
  ) {
    function urlValidator(control: Control): { [s: string]: boolean } {
      let regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (control.value.length > 0 && !control.value.match(regex)) {
        return {invalidUrl: true};
      }
    }
    this.addPostForm = _fb.group({
      'title': ['', Validators.compose([
        Validators.required])],
      'url': ['', Validators.compose([
        Validators.required, urlValidator])]
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
        console.log(res);
      },
      err => {
        console.log(err);
        /*let error = '';
        if (err._body['url']) {
          error = 'Invalid link.';
        }
        this._alertService.addAlert({
          'message': error,
          'type': 'danger',
          'timeout': 8000,
          'dismissible': false
        })*/
      },
      () => {
        console.log('finished');
        this._router.navigate(['Home']);
      }
    );
  }
  ngOnInit() {

  }
}
