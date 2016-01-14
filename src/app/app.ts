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

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [ ...FORM_PROVIDERS ],
  directives: [ ...ROUTER_DIRECTIVES, Navbar, Alerts ],
  pipes: [],
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
  { path: '/signup', component: Signup, name: 'Signup'}
  //{ path: '/**', redirectTo: ['Home'] }
])
export class App {
  url: string = '';
  constructor(public http: Http) {

  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 * or via chat on Gitter at https://gitter.im/AngularClass/angular2-webpack-starter
 */
