/*
 * These are globally available services in any component or any other service
 */

// Angular 2
import { provide } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// Angular 2 Http
import { HTTP_PROVIDERS, Http } from '@angular/http';
// Angular 2 Router
import { provideRouter } from '@angular/router';
// Angular 2 forms
import { disableDeprecatedForms, provideForms } from '@angular/forms';

// AngularClass
import { provideWebpack } from '@angularclass/webpack-toolkit';
import { providePrefetchIdleCallbacks } from '@angularclass/request-idle-callback';

import { routes, asyncRoutes, prefetchRouteCallbacks } from '../app/app.routes';
import { APP_RESOLVER_PROVIDERS } from '../app/app.resolver';

// Other
import { MODAL_BROWSER_PROVIDERS } from 'angular2-modal/platform-browser';

// AuthHttp
import { AuthHttp, JwtHelper, AuthConfig, AUTH_PROVIDERS } from 'angular2-jwt';

// Services
import { AlertService } from '../app/services/alerts/alertsService';
import { AuthService } from '../app/services/auth/authService';
import { UserService } from '../app/services/users/usersService';

import { AuthGuard } from '../app/guards/auth-guard.service';

/*
* Application Providers/Directives/Pipes
* providers/directives/pipes that only live in our browser environment
*/
export const APPLICATION_PROVIDERS = [
  // new Angular 2 forms
  disableDeprecatedForms(),
  provideForms(),

  ...APP_RESOLVER_PROVIDERS,
  ...MODAL_BROWSER_PROVIDERS,

  provideRouter(routes),
  provideWebpack(asyncRoutes),
  providePrefetchIdleCallbacks(prefetchRouteCallbacks),

  ...HTTP_PROVIDERS,

  { provide: LocationStrategy, useClass: HashLocationStrategy },

  AlertService,
  AuthService,
  UserService,
  AuthGuard,
  AuthHttp,
  JwtHelper,

  provide(AuthConfig, {
    useValue: new AuthConfig({
      headerName: 'Authorization',
      headerPrefix: 'Bearer',
      tokenName: 'auth_token',
      tokenGetter: () => localStorage.getItem('auth_token'),
      noJwtError: true
    })
  }),
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
