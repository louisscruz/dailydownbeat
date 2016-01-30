import {Component} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Http} from 'angular2/http';
import {CORE_DIRECTIVES} from 'angular2/common';

import {Posts} from '../posts/posts';

@Component({
  selector: 'home',
  directives: [ FORM_DIRECTIVES, Posts ],
  styles: [ require('./home.css') ],
  template: require('./home.html')
})
export class Home {
}
