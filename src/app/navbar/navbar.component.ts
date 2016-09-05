import { Component, HostListener } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { HTTP_PROVIDERS, Http, ConnectionBackend } from '@angular/http';

import { AuthService } from '../services/auth/authService';
import { AlertService } from '../services/alerts/alertsService';

import { DROPDOWN_DIRECTIVES } from '../directives/dropdown';

@Component({
  selector: 'navbar',
  directives: [ ROUTER_DIRECTIVES, DROPDOWN_DIRECTIVES ],
  styles: [ require('../global-variables.scss'), require('./navbar.scss') ],
  template: require('./navbar.html'),
  providers: [ Http, ConnectionBackend, HTTP_PROVIDERS ]
})
export class Navbar {
  private isCollapsed: boolean = true;

  constructor(
    private _http: Http,
    private _router: Router,
    private _authService: AuthService
  ) {}

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  collapse() {
    this.isCollapsed = true;
  }

  logout() {
    this._authService.logout()
    .subscribe(
      data => console.log(data),
      err => console.log(err),
      () => {
        this._authService.deleteJwt();
        this._router.navigate(['./']);
      }
    );
  }
}
