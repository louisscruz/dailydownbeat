import {Input, OnInit, Component} from "angular2/core";

@Component({
  selector: "pluralize",
  template: `<span>{{content}}</span>`
})
export class Pluralize implements OnInit {
  @Input() count: number;
  @Input() when: any;
  @Input() offset: number;
  private content: string;

  ngOnInit() {
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
}