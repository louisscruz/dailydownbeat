import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {Http} from 'angular2/http';

@Component({
  selector: 'navbar',
  directives: [ROUTER_DIRECTIVES],
  pipes: [],
  styles: [ require('./navbar.scss') ],
  template: require('./navbar.html')
})
export class Navbar {

}
