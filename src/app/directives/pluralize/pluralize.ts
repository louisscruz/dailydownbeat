import { Input, Component } from '@angular/core';

@Component({
  selector: 'pluralize',
  template: `<span>{{content}}</span>`,
})

export class Pluralize {
  @Input() count: number;
  @Input() when: any;
  @Input() offset: number;
  private content: string;

  setContent(): void {
    let when = this.when;
    let count = this.count;
    let oneOffset = this.offset ? this.offset + 1 : 1;
    let remainingOffset = this.offset ? count - this.offset : count;
    let content = when[0] || '';

    if (this.when) {
      if (when[count]) {
        content = when[count];
      } else if (count === oneOffset && when.one) {
        content = when.one;
      } else {
        content = when.other || '';
      }
      content = content.replace('{}', remainingOffset);
    }
    this.content = content;
  }

  ngOnInit() {
    this.setContent();
  }

  ngOnChanges(changes) {
    this.setContent();
  }
}
