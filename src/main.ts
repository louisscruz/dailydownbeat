/*
 * Providers provided by Angular
 */
import {provide, enableProdMode} from 'angular2/core';
import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, PathLocationStrategy, APP_BASE_HREF} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

const ENV_PROVIDERS = [];

if ('production' === process.env.ENV) {
  enableProdMode();
} else {
  ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS);
}

/*
 * App Component
 * our top level component that holds all of our components
 */
import {App} from './app/app';
import {AuthHttp, AuthConfig, JwtHelper} from 'angular2-jwt';
import {AuthService} from './app/services/auth/authService';
import {PostService} from './app/services/posts/postsService';

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */

document.addEventListener('DOMContentLoaded', function main() {
  bootstrap(App, [
    ...ENV_PROVIDERS,
    ...HTTP_PROVIDERS,
    ...ROUTER_PROVIDERS,
    provide(LocationStrategy, { useClass: PathLocationStrategy }),
    provide(APP_BASE_HREF, { useValue: '/' }),
    provide(AuthConfig, {
      useValue: new AuthConfig({
        headerName: 'Authorization',
        headerPrefix: 'Bearer',
        tokenName: 'auth_token',
        tokenGetter: () => localStorage.getItem('auth_token'),
        noJwtError: true
      })
    }),
    AuthHttp,
    JwtHelper,
    AuthService,
    PostService
  ])
  .catch(err => console.error(err));

});


/*
 * Modified for using hot module reload
 */

// typescript lint error 'Cannot find name "module"' fix
declare let module: any;

// activate hot module reload
if (module.hot) {

  // bootstrap must not be called after DOMContentLoaded,
  // otherwise it cannot be rerenderd after module replacement
  //
  // for testing try to comment the bootstrap function,
  // open the dev tools and you'll see the reloader is replacing the module but cannot rerender it
  bootstrap(App, [
      ...ENV_PROVIDERS,
      ...HTTP_PROVIDERS,
      ...ROUTER_PROVIDERS,
      provide(LocationStrategy, { useClass: PathLocationStrategy }),
      provide(APP_BASE_HREF, { useValue: '/' }),
      provide(AuthConfig, {
        useValue: new AuthConfig({
          headerName: 'Authorization',
          headerPrefix: 'Bearer',
          tokenName: 'auth_token',
          tokenGetter: () => localStorage.getItem('auth_token'),
          noJwtError: true
        })
      }),
      AuthHttp,
      JwtHelper,
      AuthService,
      PostService
    ])
    .catch(err => console.error(err));

  module.hot.accept();
}

// For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
// Also see custom_typings.d.ts as you also need to do `typings install x` where `x` is your module
