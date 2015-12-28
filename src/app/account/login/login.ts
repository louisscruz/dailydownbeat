import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators} from 'angular2/common';
import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';

import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';
import {UserService} from '../../services/users/usersService';
import {User} from '../../datatypes/user/user';

@Component({
  selector: 'login',
  template: require('./login.html'),
  directives: [ ButtonRadio, FORM_DIRECTIVES ],
  bindings: [UserService]
})

export class Login {
  loginForm: ControlGroup;
  user = new User('', '');


  constructor(fb: FormBuilder, public http: Http, private router: Router, private userService: UserService) {
    function emailValidator(control: Control): { [s: string]: boolean} {
      if (!control.value.match(/.+@.+\..+/i)) {
        return {invalidEmail: true}
      }
    }
    this.loginForm = fb.group({
      'username': ['', Validators.required],
      'email': ['', Validators.compose([
        Validators.required, emailValidator])]
    })
    this.userService = userService;
  }
  /*login(user: User[]) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
     this.http.post('http://localhost:3000/login', JSON.stringify(user), {
       headers: headers
     })
     .map(res => res.json())
     .subscribe(
       data => this.saveJwt(data.auth_token),
       err => alert(err),
       () => this.router.navigate(['Home'])
     );
  };

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
  }*/
}
