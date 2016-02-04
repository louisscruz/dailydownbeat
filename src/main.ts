/*
 * Providers provided by Angular
 */
import {provide} from 'angular2/core';
import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS, Http, ConnectionBackend} from 'angular2/http';

/*
 * App Component
 * our top level component that holds all of our components
 */
import {App} from './app/app';
/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
import {AuthHttp, JwtHelper, AuthConfig} from 'angular2-jwt';

import {AuthService} from './app/services/auth/authService';

document.addEventListener('DOMContentLoaded', function main() {
  bootstrap(App, [
    ('production' === process.env.ENV ? [] : ELEMENT_PROBE_PROVIDERS),
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    provide(AuthConfig, {
      useValue: new AuthConfig({
        headerName: 'Authorization',
        headerPrefix: 'Bearer',
        tokenName: 'auth_token',
        tokenGetter: () => localStorage.getItem('auth_token'),
        noJwtError: true
      })
    }),
    AuthHttp
  ])
  .catch(err => console.error(err));
});
