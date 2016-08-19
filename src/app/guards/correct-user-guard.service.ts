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
    let id = +route.params['id'];
    if (!!this._authService.currentUser && this._authService.currentUser.id === id) {
      return true;
    }

    this._authService.redirectUrl = state.url;

    this.router.navigate([ '/login' ]);
    return false;
  }
}
