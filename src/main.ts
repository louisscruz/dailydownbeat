/*
 * Providers provided by Angular
 */
import * as browser from 'angular2/platform/browser';
import * as ngCore from 'angular2/core';
import {
  ROUTER_PROVIDERS,
  ROUTER_DIRECTIVES,
  LocationStrategy,
  PathLocationStrategy
} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AuthHttp, AuthConfig, JwtHelper} from 'angular2-jwt';

/*
 * App Component
 * our top level component that holds all of our components
 */
import {App} from './app/app';
import {RouterActive} from './app/directives/router-active';
import {Navbar} from './app/navbar/navbar';
import {Alerts} from './app/alerts/alerts';
import {Footer} from './app/footer/footer';
import {AuthService} from './app/services/auth/authService';
import {AlertService} from './app/services/alerts/alertsService';
//import {FooterContent} from './app/footer-content/footer-content';

/*
 * Application Providers/Directives/Pipes
 * providers/directives/pipes that only live in our browser environment
 */
// application_providers: providers that are global through out the application
const APPLICATION_PROVIDERS = [
  ...HTTP_PROVIDERS,
  ...ROUTER_PROVIDERS,
  ...FORM_PROVIDERS,
  AuthService,
  AuthHttp,
  JwtHelper,
  AlertService,
  ngCore.provide(AuthConfig, {
    useValue: new AuthConfig({
      headerName: 'Authorization',
      headerPrefix: 'Bearer',
      tokenName: 'auth_token',
      tokenGetter: () => localStorage.getItem('auth_token'),
      noJwtError: true
    })
  }),
  ngCore.provide(LocationStrategy, { useClass: PathLocationStrategy })
];

// application_directives: directives that are global through out the application
const APPLICATION_DIRECTIVES = [
  ...ROUTER_DIRECTIVES,
  RouterActive,
  Navbar,
  Alerts,
  Footer//,
  //FooterContent
];

// application_pipes: pipes that are global through out the application
const APPLICATION_PIPES = [

];

// Environment
if ('production' === ENV) {
  // Production
  ngCore.enableProdMode();
  APPLICATION_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS_PROD_MODE);
} else {
  // Development
  APPLICATION_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS);
}

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
export function main() {
  return browser.bootstrap(App, [
    ...APPLICATION_PROVIDERS,
    ngCore.provide(ngCore.PLATFORM_DIRECTIVES, {useValue: APPLICATION_DIRECTIVES, multi: true}),
    ngCore.provide(ngCore.PLATFORM_PIPES, {useValue: APPLICATION_PIPES, multi: true})
  ])
  .catch(err => console.error(err));
}

/*
 * Vendors
 * For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
 * You can also import them in vendors to ensure that they are bundled in one file
 * Also see custom-typings.d.ts as you also need to do `typings install x` where `x` is your module
 */
/*
 * Hot Module Reload
 * experimental version by @gdi2290
 */

function bootstrapDomReady() {
  // bootstrap after document is ready
  return document.addEventListener('DOMContentLoaded', main);
}

if ('development' === ENV) {
  // activate hot module reload
  if (HMR) {
    if (document.readyState === 'complete') {
      main();
    } else {
      bootstrapDomReady();
    }
    module.hot.accept();
  } else {
    bootstrapDomReady();
  }
} else {
  bootstrapDomReady();
}
