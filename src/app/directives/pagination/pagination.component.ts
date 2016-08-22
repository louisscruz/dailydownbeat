import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pagination',
  template: require('./pagination.html')
})
export class PaginationComponent {
  @Input() public currentPage: number;

  @Output() pageChanged = new EventEmitter();

  selectPage(page: number): void {
    this.pageChanged.emit({
      page: page
    });
  }
}
