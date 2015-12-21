import {Component} from 'angular2/core';
import {PostObject} from '../assets/postObject';

@Component({
  selector: 'posts',
  template: require('./posts.html')
})

export class Posts {
  posts = [
    new PostObject('This is a title', 53),
    new PostObject('Another title', 44)
  ];
}
