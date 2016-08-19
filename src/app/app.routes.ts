import { WebpackAsyncRoute } from '@angularclass/webpack-toolkit';
import { RouterConfig } from '@angular/router';
//import { NoContent } from './no-content';

import { Home } from './home';
import { Login } from './account/login';
import { Signup } from './account/signup';

import { DataResolver } from './app.resolver';

import { AuthGuard } from './guards/auth-guard.service';
import { CorrectUserGuard } from './guards/correct-user-guard.service';

export const routes: RouterConfig = [

  { path: '',
    component: Home
  }, {
    path: 'about',
    component : 'About'
  }, {
    path: 'login',
    component: Login
  }, {
    path: 'signup',
    component: Signup,
  }, {
    path: 'post/:id',
    component: 'PostDetail'
  }, {
    path: 'add_post',
    component: 'AddPost',
    canActivate: [ AuthGuard ]
  }, {
    path: 'user/:id',
    component: 'UserDetail',
  }, {
    path: 'dashboard/:id',
    component: 'Dashboard',
    canActivate: [ CorrectUserGuard ]
  }, {
    path: 'user/:id/confirm/:confirmation_code',
    component: 'Confirm'
  }, {
    path: 'donate',
    component: 'Donate'
  }, {
    path: 'contact',
    component: 'Contact'
  }/* {
    path: '/post',
    component: AddPost,
    name: 'AddPost'
  }, {
    path: '/user/:id',
    component: UserDetail,
    name: 'UserDetail'
  }, {
    path: '/user/:id/confirm/:confirmation_code',
    name: 'Confirm',
    loader: () => require('es6-promise!./account/confirm/confirm')('Confirm')
  }, {
    path: '/user/:id/dashboard',
    name: 'Dashboard',
    loader: () => require('es6-promise!./account/dashboard/dashboard')('Dashboard')
  }, {
    path: '/about',
    component: About,
    name: 'About'
  }, {
    path: '/donate',
    name: 'Donate',
    loader: () => require('es6-promise!./donate/donate')('Donate')
  }, {
    path: '/contact',
    name: 'Contact',
    loader: () => require('es6-promise!./contact/contact')('Contact')
  }
  /*
  { path: '',      component: Home },
  { path: 'home',  component: Home },
  // make sure you match the component type string to the require in asyncRoutes
  { path: 'about', component: 'About',
    resolve: {
      'yourData': DataResolver
    }},
  // async components with children routes must use WebpackAsyncRoute
  { path: 'detail', component: 'Detail',
    canActivate: [ WebpackAsyncRoute ],
    children: [
      { path: '', component: 'Index' }  // must be included
    ]},
  //{ path: '**',    component: NoContent },*/
];

// Async load a component using Webpack's require with es6-promise-loader and webpack `require`
// asyncRoutes is needed for our @angularclass/webpack-toolkit that will allow us to resolve
// the component correctly

export const asyncRoutes: AsyncRoutes = {
  // we have to use the alternative syntax for es6-promise-loader to grab the routes
  'About': require('es6-promise-loader!./about'),
  'PostDetail': require('es6-promise-loader!./post'),
  'AddPost': require('es6-promise-loader!./addPost'),
  'UserDetail': require('es6-promise-loader!./user'),
  'Dashboard': require('es6-promise-loader!./account/dashboard'),
  'Confirm': require('es6-promise-loader!./account/confirm'),
  'Donate': require('es6-promise-loader!./donate'),
  'Contact': require('es6-promise-loader!./contact')
  //'Detail': require('es6-promise-loader!./+detail'),
  //'Index': require('es6-promise-loader!./+detail'), // must be exported with detail/index.ts
};


// Optimizations for initial loads
// An array of callbacks to be invoked after bootstrap to prefetch async routes
export const prefetchRouteCallbacks: Array<IdleCallbacks> = [
  //asyncRoutes['About'],
  asyncRoutes['PostDetail'],
  asyncRoutes['UserDetail'],
   // es6-promise-loader returns a function
];


// Es6PromiseLoader and AsyncRoutes interfaces are defined in custom-typings
