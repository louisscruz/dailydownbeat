import {Component} from 'angular2/core';
import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'login',
  template: require('./login.html'),
  directives: [ ButtonRadio ]
})

export class Login {
  private radioModel:string = 'Login';

  submit() {
    alert('woohoo');
  };
}
