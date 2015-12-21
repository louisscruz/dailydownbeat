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

// Load the implementations that should be tested
import {Posts} from './posts';
import {PostObject} from '../assets/postObject';

describe('Posts', () => {
  var posts;
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    Posts,
    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: function(backend, defaultOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]})
  ]);

  beforeEach(() => {
    posts = [
      new PostObject('This is a title', 53),
      new PostObject('Another title', 44)
    ];
  });

  //it('should have a title', inject([ Home ], (app) => {
    //expect(app.title.value).toEqual('Angular 2');
  //}));
  it('should load all posts', inject([ Posts ], (app) => {
    expect(posts).toEqual(posts);
  }));
});
