/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, JwtHelper } from 'angular2-jwt';
import { Modal, BS_MODAL_PROVIDERS } from 'angular2-modal/plugins/bootstrap';
import { Router, NavigationEnd } from '@angular/router';

import { Navbar } from './navbar';
import { Alerts } from './alerts';
import { Footer } from './footer';

import { AppState } from './app.service';
import { AuthService } from './services/auth/authService';
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  directives: [ Navbar, Alerts, Footer ],
  providers: [ AppState ],
  viewProviders: [ ...BS_MODAL_PROVIDERS ],
  styles: [ require('./app.scss'), require('./global-variables.scss') ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div id="content">
      <header>
        <navbar></navbar>
      </header>

      <alerts></alerts>

      <main [class.container]="!appState.removeContainer">
        <router-outlet></router-outlet>
      </main>

      <footer></footer>
    </div>
  `
})
export class App {
  private currentRoute: string;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private appState: AppState,
    private modal: Modal,
    private viewContainer: ViewContainerRef
  ) {
    modal.defaultViewContainer = viewContainer;
    if (ENV === 'production') {
      _router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          let newRoute = this._router.url || '/';
          if (this.currentRoute != newRoute) {
            ga('send', 'pageview', newRoute);
            this.currentRoute = newRoute;
          }
        }
      });
    }
  }

  ngOnInit() {
    this._authService.isLoggedIn();
  }

  ngAfterViewInit() {
    //console.log(this.router.url);
  }
}
