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
import {Confirm} from './account/confirm/confirm';
import {PostDetail} from './post/post';
import {AddPost} from './addPost/addPost';
import {UserDetail} from './user/user';
import {Dashboard} from './account/dashboard/dashboard';

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

    <main class="container">
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
  { path: '/signup', component: Signup, name: 'Signup' },
  { path: '/post/:id', component: PostDetail, name: 'PostDetail' },
  { path: '/add', component: AddPost, name: 'AddPost' },
  { path: '/user/:id', component: UserDetail, name: 'UserDetail' },
  { path: '/user/:id/confirm/:confirmation_code', component: Confirm, name: 'Confirm' },
  { path: '/user/:id/dashboard', component: Dashboard, name: 'Dashboard'}
  //{ path: '/**', redirectTo: ['Home'] }
])
export class App {
  constructor() {}
}
