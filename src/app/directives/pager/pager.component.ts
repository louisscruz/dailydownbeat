import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pager',
  template: require('./pager.html')
})
export class PagerComponent {
  @Input() currentPage: number;
  @Input() totalItems: number;
  @Input() perPage: number;

  @Output() pageChanged = new EventEmitter();

  constructor() {}

  pagesRemaining(): boolean {
    return (this.totalItems - (this.currentPage * this.perPage) > 0)
  }

  selectPage(page): void {
    this.pageChanged.emit({
      page: page
    });
  }
}
