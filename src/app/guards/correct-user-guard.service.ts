import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from '../services/auth/authService';

@Injectable()
export class CorrectUserGuard implements CanActivate {

  constructor(private _authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let username = route.params['username'];
    if (!!this._authService.currentUser && this._authService.currentUser.username === username) {
      return true;
    }

    this._authService.redirectUrl = state.url;

    this.router.navigate([ '/login' ]);
    return false;
  }
}
