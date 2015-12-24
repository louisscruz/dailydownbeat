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
import {Post} from '../datatypes/post/post';

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
      new Post('This is a title'),
      new Post('Another title')
    ];
  });

  //it('should have a title', inject([ Home ], (app) => {
    //expect(app.title.value).toEqual('Angular 2');
  //}));
  it('should load all posts', inject([ Posts ], (app) => {
    expect(posts).toEqual(posts);
  }));
});
