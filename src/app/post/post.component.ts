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
import { Pluralize } from '../directives/pluralize/pluralize';

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
  providers: [ CommentService ],
  styles: [ require('./post.scss') ],
  template: require('./post.html')
})

export class PostDetail {
  private editPostForm: FormGroup;
  private title: AbstractControl;
  private url: AbstractControl;
  private addCommentForm: FormGroup;
  public isCollapsed: boolean = true;
  private post: Post;
  private comment: AbstractControl;
  private comments: Array<any>;
  private loadingComments: boolean = false;
  private addingComment: boolean = false;
  private sendingVote: number = null;
  private sendingEdit: boolean = false;
  private editing: boolean = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _postService: PostService,
    private _commentService: CommentService,
    private modal: Modal
  ) {
    this.editPostForm = new FormGroup({
      title: new FormControl(),
      url: new FormControl()
    });
    this.title = this.editPostForm.find('title');
    this.url = this.editPostForm.find('url');
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
    this.addingComment = true;
    this._commentService.addComment(body, commentableType, commentableId, this._authService.currentUser.id)
    .subscribe(
      res => {
        this.insertComment(res);
        let alert = new AlertNotification('Successfully added your comment!', 'success');
        this._alertService.addAlert(alert);
      },
      err => {
        console.log(err);
        this.addingComment = false;
        let body = JSON.parse(err._body);
        let alert = new AlertNotification('There was an error posting your comment.', 'danger');
        if (body['user'] !== null) {
          alert.message = 'You must confirm your account before making comments.'
        }
        this._alertService.addAlert(alert);
      },
      () => {
        this.addingComment = false;
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

    while (maximumIndex >= minimumIndex) {
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

  handleUpvote(post: Post) {
    if (this._authService.currentUser) {
      post.upvoted ? this.unvote(post, 1) : this.upvote(post);
    } else {
      let alert = new AlertNotification('You have to be logged in to vote!', 'warning');
      this._alertService.addAlert(alert);
    }
  }

  handleDownvote(post: Post) {
    if (this._authService.currentUser) {
      post.downvoted ? this.unvote(post, -1) : this.downvote(post);
    } else {
      let alert = new AlertNotification('You have to be logged in to vote!', 'warning');
      this._alertService.addAlert(alert);
    }
  }

  upvote(post: Post) {
    this.sendingVote = post.id;
    this._postService.upvote(post).subscribe(
      res => {
        let alert = new AlertNotification('Successfully upvoted post!', 'success', 3000);
        this._alertService.addAlert(alert);
        post.downvoted ? post.points += 2 : post.points++;
        post.upvoted = true;
        post.downvoted = false;
        this.sendingVote = null;
      }, err => {
        console.log(err);
        let alert = new AlertNotification('There was a problem sending your vote.', 'danger');
        let body = JSON.parse(err._body);
        console.log(body['user'])
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

  downvote(post: Post) {
    this.sendingVote = post.id;
    this._postService.downvote(post).subscribe(
      res => {
        let alert = new AlertNotification('Successfully downvoted post!', 'success', 3000);
        this._alertService.addAlert(alert);
        post.upvoted ? post.points -= 2 : post.points--;
        post.downvoted = true;
        post.upvoted = false;
        this.sendingVote = null;
      }, err => {
        console.log(err);
        let alert = new AlertNotification('There was a problem sending your vote.', 'danger');
        let body = JSON.parse(err._body);
        if (body['user'] && body['user'][0] === 'must be confirmed to make posts.') {
          alert.message = 'You must first confirm your account before voting. We sent you an email to handle this when you created your account.';
        } else if (err.status == 401) {
          alert.message = 'You have to be logged in to vote.';
          alert.type = 'warning';
        }
        this._alertService.addAlert(alert);
        this.sendingVote = null;
      }
    );
  }

  unvote(post: Post, polarity: number) {
    this.sendingVote = post.id;
    this._postService.unvote(post).subscribe(
      res => {
        let alert = new AlertNotification('Vote successfully updated!', 'success', 3000);
        this._alertService.addAlert(alert);
        post.points -= polarity;
        post.upvoted = false;
        post.downvoted = false;
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
      (<FormControl>this.editPostForm.find('title')).updateValue(this.post.title);
      (<FormControl>this.editPostForm.find('url')).updateValue(this.post.url);
    }
    this.editing = !this.editing;
  }

  updatePost() {
    this.sendingEdit = true;
    let updatedPost = { id: this.post.id, title: this.title.value, url: this.url.value };
    this._postService.updatePost(updatedPost).subscribe(
      res => {
        this.post = res;
        let alert = new AlertNotification('Succesfully updated post!', 'success', 3000);
        this._alertService.addAlert(alert);
        this.resetEditForm();
        this.sendingEdit = false;
      }, err => {
        let alert = new AlertNotification('There was an error updating your post.', 'danger');
        this._alertService.addAlert(alert);
        this.sendingEdit = false;
      }
    )
  }

  resetEditForm() {
    this.editing = false;
    (<FormControl>this.title).updateValue('');
    (<FormControl>this.url).updateValue('');
  }

  ngOnInit() {
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
