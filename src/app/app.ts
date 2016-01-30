/*
 * Angular 2 decorators and services
 */
require('!!style!css!bootstrap/dist/css/bootstrap.css');
import {Component, provide} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {FORM_PROVIDERS} from 'angular2/common';

import {Navbar} from './navbar/navbar';
import {Alerts} from './alerts/alerts';
import {Home} from './home/home';
import {Login} from './account/login/login';
import {Signup} from './account/signup/signup';
import {PostDetail} from './post/post';
import {UserDetail} from './user/user';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [ ...FORM_PROVIDERS ],
  directives: [ ...ROUTER_DIRECTIVES, Navbar, Alerts ],
  styles: [ require('./app.scss'), require('./global-variables.scss') ],
  template: `
    <header>
      <navbar></navbar>
    </header>
    <alerts></alerts>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer class="footer">
      <div class="col-xs-12">
        <!--small>Daily Downbeat made by Louis Cruz</small-->
        <small>Test Footer</small>
      </div>
    </footer>
  `
})
@RouteConfig([
  { path: '/', component: Home, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/signup', component: Signup, name: 'Signup'},
  { path: '/post/:id', component: PostDetail, name: 'PostDetail'},
  { path: '/user/:id', component: UserDetail, name: 'UserDetail'}
  //{ path: '/**', redirectTo: ['Home'] }
])
export class App {
  constructor(private _http: Http) {
  }
}
