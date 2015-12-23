import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators} from 'angular2/common';
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
  }

  submit(value: string): void{
    console.log(value);
  };
}
