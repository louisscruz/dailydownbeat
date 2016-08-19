import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { NavigationExtras } from '@angular/router/src/router.d';

import { AuthService } from '../services/auth/authService';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._authService.currentUser) { return true; }

    this._authService.redirectUrl = state.url;

    let sessionRedirect = '/add_post';

    let navigationExtras: NavigationExtras = {
      queryParams: { 'session_redirect': sessionRedirect }
    }

    this.router.navigate([ '/login' ], navigationExtras);
    return false;
  }
}
