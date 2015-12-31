import {Component} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Http} from 'angular2/http';
import {CORE_DIRECTIVES} from 'angular2/common';
import {PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {Posts} from '../posts/posts';

@Component({
  selector: 'home',
  directives: [ FORM_DIRECTIVES, Posts ],
  providers: [ ],
  pipes: [],
  styles: [ require('./home.css') ],
  template: require('./home.html')
})
export class Home {
  /* TypeScript public modifiers
  constructor(public title: Title, public http: Http) {
  }

  ngOnInit() {
    console.log('hello Home');
  }*/
  values: number[] = [1, 2, 3];
}
