import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators} from 'angular2/common';
import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {UserService} from '../../services/users/usersService';
import {User} from '../../datatypes/user/user';
import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'signup',
  template: require('./signup.html'),
  directives: [ ButtonRadio, FORM_DIRECTIVES ],
  bindings: [UserService]
})

export class Signup {
  private signupForm: ControlGroup;
  private user: User[];

  constructor(fb: FormBuilder, public userService: UserService, public http: Http, private router: Router) {
    function emailValidator(control: Control): { [s: string]: boolean} {
      if (!control.value.match(/.+@.+\..+/i)) {
        return {invalidEmail: true};
      }
    }
    this.signupForm = fb.group({
      'username': ['', Validators.required],
      'email': ['', Validators.compose([
        Validators.required, emailValidator])],
      'password': ['', Validators.required],
      'password_confirmation': ['', Validators.required]
    });
    /*function postUser(user) {
      console.log('working');
      console.log(user);
      userService.postUser(user).subscribe(res => this.user = res);
    }*/
  }
  postUser(user) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post('http://localhost:3000/users', JSON.stringify(user), {
      headers: headers
    })
    .map(res => res.json())
    .subscribe(
      res => alert('yippee'),
      err => console.log(err),
      () => this.router.navigate(['Home'])
    )
  }
}
