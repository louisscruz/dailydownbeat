import {Component, OnInit, ElementRef, Renderer, Self, Input} from 'angular2/core';
import {NgModel, NgClass} from 'angular2/common';

import {Pagination} from './pagination';

const pagerConfig = {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
};

const PAGER_TEMPLATE = `
  <ul class="container">
    <li class="btn btn-link"
        [style.display]="noPrevious() ? 'none' : 'inherit'"
        [class.previous]="align" [ngClass]="{'pull-left': align}" [class.disabled]="loading">
      <a href (click)="selectPage(page - 1, $event)" [class.disabled]="loading">{{getText('previous')}}</a>
    </li>
    <li class="btn btn-link"
        [hidden]="noNext()" [class.next]="align" [ngClass]="{'pull-right': align}" [class.disabled]="loading">
      <a href (click)="selectPage(page + 1, $event)">{{getText('next')}}</a>
    </li>
  </ul>
`;

@Component({
  selector: 'pager',
  template: PAGER_TEMPLATE,
  directives: [NgClass],
  inputs: [
    'align',
    'totalItems', 'itemsPerPage',
    'previousText', 'nextText',
    'loading'
  ]
})
export class Pager extends Pagination implements OnInit {
  public config = pagerConfig;

  constructor(@Self() cd: NgModel, renderer: Renderer, elementRef: ElementRef) {
    super(cd, renderer, elementRef);
  }
}
