import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pager',
  template: require('./pager.html')
})
export class PagerComponent {
  @Input() currentPage: number;

  @Output() pageChanged = new EventEmitter();

  constructor() {}

  selectPage(page): void {
    this.pageChanged.emit({
      page: page
    });
  }
}
