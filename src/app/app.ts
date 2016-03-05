/*
 * Angular 2 decorators and services
 */
require('!!style!css!bootstrap/dist/css/bootstrap.css');
require('font-awesome-sass-loader');
import {Component, provide, OnInit} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {FORM_PROVIDERS} from 'angular2/common';

import {Navbar} from './navbar/navbar';
import {Alerts} from './alerts/alerts';
import {Footer} from './footer/footer';
import {Home} from './home/home';
import {Login} from './account/login/login';
import {Signup} from './account/signup/signup';
import {Confirm} from './account/confirm/confirm';
import {PostDetail} from './post/post';
import {AddPost} from './addPost/addPost';
import {UserDetail} from './user/user';
import {Dashboard} from './account/dashboard/dashboard';
import {About} from './about/about';

import {AuthService} from './services/auth/authService';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [ ...FORM_PROVIDERS ],
  directives: [ ...ROUTER_DIRECTIVES, Navbar, Alerts, Footer ],
  styles: [ require('./app.scss'), require('./global-variables.scss') ],
  template: `
    <header>
      <navbar></navbar>
    </header>
    <alerts></alerts>

    <main class="container">
      <router-outlet></router-outlet>
    </main>

    <footer class="container">
      <footer-content></footer-content>
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
  { path: '/user/:id/dashboard', component: Dashboard, name: 'Dashboard'},
  { path: '/about', component: About, name: 'About'}
  //{ path: '/**', redirectTo: ['Home'] }
])
export class App implements OnInit {
  private apiUrl: string = process.env.API_URL;
  constructor(private _authService: AuthService) {}

  ngOnInit() {
    this._authService.isLoggedIn();
    console.log(this.apiUrl);
  }
}
