import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { DROPDOWN_DIRECTIVES } from '../directives/dropdown';
import { Collapse } from '../directives/collapse/collapse';

import { Post } from '../datatypes/post/post';
import { AlertNotification } from '../datatypes/alert/alertnotification';
import { CommentDetail } from '../comment';
import { flagContent, deleteContent } from '../modal/modalPresets';

import { AlertService } from '../services/alerts/alertsService';
import { AuthService } from '../services/auth/authService';
import { PostService } from '../services/posts/postsService';
import { CommentService } from '../services/comments/commentService';

import { OrderBy } from '../pipes/orderBy';
import { TimeSincePipe } from '../pipes/timeSince';

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
  private loadingComments: boolean = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _postService: PostService,
    private _commentService: CommentService,
    private modal: Modal
  ) {}

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
        () => console.log(this.post)
      );
      this._postService.getPostComments(id)
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
