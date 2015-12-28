import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators} from 'angular2/common';
import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';

import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';
import {AuthService} from '../../services/auth/authService';
import {User} from '../../datatypes/user/user';

@Component({
  selector: 'login',
  template: require('./login.html'),
  directives: [ ButtonRadio, FORM_DIRECTIVES ],
  bindings: [AuthService]
})

export class Login {
  loginForm: ControlGroup;
  user = new User('', '');

  constructor(fb: FormBuilder, public http: Http, private router: Router, private authService: AuthService) {
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
    this.authService = authService;
  }
}
