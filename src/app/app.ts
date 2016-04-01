/*
 * Angular 2 decorators and services
 */
import {Component, provide, HostBinding, OnInit} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS, Http} from 'angular2/http';

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
import {ModalService} from './services/modal/modalService';
import {Modal} from './modal/modal';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [],
  directives: [],
  styles: [ require('./app.scss'), require('./global-variables.scss') ],
  template: `
    <modal></modal>
    <header>
      <navbar></navbar>
    </header>
    <alerts class="alerts"></alerts>

    <main class="container">
      <router-outlet></router-outlet>
    </main>

    <footer class="container">
      <footer-content></footer-content>
    </footer>
  `
})
@RouteConfig([
  { path: '/',
    component: Home,
    name: 'Home',
    useAsDefault: true
  }, {
    path: '/login',
    component: Login,
    name: 'Login'
  }, {
    path: '/signup',
    component: Signup,
    name: 'Signup'
  }, {
    path: '/post/:id',
    name: 'PostDetail',
    loader: () => require('es6-promise!./post/post')('PostDetail')
  }, {
    path: '/post',
    component: AddPost,
    name: 'AddPost'
  }, {
    path: '/user/:id',
    component: UserDetail,
    name: 'UserDetail'
  }, {
    path: '/user/:id/confirm/:confirmation_code',
    name: 'Confirm',
    loader: () => require('es6-promise!./account/confirm/confirm')('Confirm')
  }, {
    path: '/user/:id/dashboard',
    name: 'Dashboard',
    loader: () => require('es6-promise!./account/dashboard/dashboard')('Dashboard')
  }, {
    path: '/about',
    component: About,
    name: 'About'
  }, {
    path: '/donate',
    name: 'Donate',
    loader: () => require('es6-promise!./donate/donate')('Donate')
  }, {
    path: '/contact',
    name: 'Contact',
    loader: () => require('es6-promise!./contact/contact')('Contact')
  }
])
export class App implements OnInit {
  constructor(
    private _authService: AuthService,
    private _modalService: ModalService
  ) {}

  ngOnInit() {
    this._authService.isLoggedIn();
  }
  @HostBinding('class.modal-open')
  public get isOpen() {
    return this._modalService.showModal;
  }
}
