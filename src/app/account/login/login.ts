import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'login',
  template: require('./login.html'),
  directives: [ ButtonRadio, FORM_DIRECTIVES ]
})

export class Login {
  private radioModel: string = 'Login';
  loginForm: ControlGroup;

  constructor(fb: FormBuilder) {
    this.loginForm = fb.group({
      'username': ['', Validators.required]
    })
  }

  submit(value: string): void{
    console.log(value);
  };
}
