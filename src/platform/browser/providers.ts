/*
 * These are globally available services in any component or any other service
 */


import {provide} from 'angular2/core';

// Angular 2
import {FORM_PROVIDERS} from 'angular2/common';

// Angular 2 Http
import {HTTP_PROVIDERS} from 'angular2/http';
// Angular 2 Router
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';

// Angular 2 Material
// TODO(gdi2290): replace with @angular2-material/all
import {MATERIAL_PROVIDERS} from './angular2-material2';

import {AuthHttp, AuthConfig, JwtHelper} from 'angular2-jwt';
import {ModalConfig} from 'angular2-modal/angular2-modal';

import {AuthService} from '../.././app/services/auth/authService';
import {AlertService} from '../.././app/services/alerts/alertsService';

/*
* Application Providers/Directives/Pipes
* providers/directives/pipes that only live in our browser environment
*/
export const APPLICATION_PROVIDERS = [
  ...FORM_PROVIDERS,
  ...HTTP_PROVIDERS,
  ...MATERIAL_PROVIDERS,
  ...ROUTER_PROVIDERS,
  AuthService,
  AuthHttp,
  JwtHelper,
  AlertService,
  provide(ModalConfig, {useValue: new ModalConfig('lg', true, 81)}),
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  provide(AuthConfig, {
    useValue: new AuthConfig({
      headerName: 'Authorization',
      headerPrefix: 'Bearer',
      tokenName: 'auth_token',
      tokenGetter: () => localStorage.getItem('auth_token'),
      noJwtError: true
    })
  })
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
