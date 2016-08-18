import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'alert',
  directives: [NgIf, NgClass],
  styles: [ require('./alert.style.scss') ],
  template: require('./alert.template.html')
})
export class Alert {
  @Input() public type: string = 'warning';
  @Input() public dismissible: boolean;
  @Input() public dismissOnTimeout: number;

  @Output() public close = new EventEmitter();

  private closed: boolean;
  private classes: Array<string> = [];

  constructor() {}

  ngOnInit() {
    this.classes[0] = `alert-${this.type}`;
    if (this.dismissible) {
      this.classes[1] = 'alert-dismissible';
    } else {
      this.classes.length = 1;
    }

    this.setDismissTimeout();
  }

  setDismissTimeout(): void {
    if (this.dismissOnTimeout && this.dismissOnTimeout != 0) {
      setTimeout(() => this.onClose(), this.dismissOnTimeout);
    }
  }

  // todo: mouse event + touch + pointer
  onClose() {
    this.closed = true;
    this.close.emit(this);
  }
}
