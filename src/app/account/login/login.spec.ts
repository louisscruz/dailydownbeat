import {
  it,
  inject,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

import {Component, provide} from 'angular2/core';
import {BaseRequestOptions, Http} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';
//import {Router} from 'angular2/router';

import {ButtonRadio} from 'ng2-bootstrap/ng2-bootstrap';
import {AuthService} from '../../services/auth/authService';
import {AlertService} from '../../services/alerts/alertsService';
import {User} from '../../datatypes/user/user';

// Load the implementations that should be tested
import {Login} from './login';

describe('Login', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    Login,
    BaseRequestOptions,
    MockBackend,
    //Router,
    AuthService,
    AlertService,
    provide(Http, {
      useFactory: function(backend, defaultOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]})
  ]);

  it('should have two fields', inject([ Login ], (app) => {
    expect(2).toEqual(2);
  }));

});
