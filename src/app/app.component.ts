/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core';
//import {Component, provide, HostBinding, OnInit} from 'angular2/core';
//import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
//import {HTTP_PROVIDERS, Http} from 'angular2/http';
import { AuthService } from './services/auth/authService';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, JwtHelper } from 'angular2-jwt';
import { Modal, BS_MODAL_PROVIDERS } from 'angular2-modal/plugins/bootstrap';
import { Navbar } from './navbar';
import { Alerts } from './alerts';
import { Footer } from './footer';
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  directives: [ Navbar, Alerts, Footer ],
  viewProviders: [ ...BS_MODAL_PROVIDERS ],
  styles: [ require('./app.scss'), require('./global-variables.scss') ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <header>
      <navbar></navbar>
    </header>

    <alerts></alerts>

    <main class="container">
      <router-outlet></router-outlet>
    </main>

    <footer></footer>
  `
})
export class App {
  constructor(
    private _authService: AuthService,
    public modal: Modal,
    //private viewContainer: ViewContainerRef
  ) {
    //modal.defaultViewContainer = viewContainer;
  }

  ngOnInit() {
    this._authService.isLoggedIn();
  }
}
