import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'footer-content',
  styles: [ require('./footer.scss') ],
  directives: [ROUTER_DIRECTIVES],
  template: require('./footer.html')
})

export class Footer {
}
