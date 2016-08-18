import { Component } from '@angular/core';
//import { FORM_DIRECTIVES } from '@angular/common';
import { Http } from '@angular/http';
import { CORE_DIRECTIVES } from '@angular/common';

import { Posts } from '../posts';

@Component({
  selector: 'home',
  directives: [ Posts ],
  styles: [ require('./home.css') ],
  template: require('./home.html')
})
export class Home {
}
