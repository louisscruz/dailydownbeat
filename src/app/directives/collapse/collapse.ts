import {Directive, Input, HostBinding} from '@angular/core';

// todo: add animate
// todo: add init and on change
@Directive({selector: '[collapse]'})
export class Collapse {
  // style
  @HostBinding('style.height')
  private height: string;
  @HostBinding('style.padding')
  private padding: string;
  @HostBinding('style.opacity')
  private opacity: string;
  @HostBinding('style.transition')
  private transition: string;
  // shown
  @HostBinding('class.in')
  @HostBinding('attr.aria-expanded')
  private isExpanded: boolean = true;
  // hidden
  @HostBinding('attr.aria-hidden')
  private isCollapsed: boolean = false;
  // stale state
  @HostBinding('class.collapse')
  private isCollapse: boolean = true;
  // animation state
  @HostBinding('class.collapsing')
  private isCollapsing: boolean = false;

  @Input()
  private set collapse(value: boolean) {
    this.isExpanded = value;
    this.toggle();
  }

  private get collapse(): boolean {
    return this.isExpanded;
  }

  constructor() {
    this.height = '0';
    this.padding = '0rem';
    this.opacity = '0';
    this.transition = 'all 0.2s ease-in-out';
    this.isExpanded = false;
    this.isCollapsed = true;
    this.isCollapse = true;
  }

  toggle() {
    if (this.isExpanded) {
      this.hide();
    } else {
      this.show();
    }
  }

  hide() {
    this.isCollapse = false;
    this.isCollapsing = true;

    this.isExpanded = false;
    this.isCollapsed = true;
    setTimeout(() => {
      this.height = '0';
      this.padding = '0rem';
      this.opacity = '0';
      this.isCollapse = true;
      this.isCollapsing = false;
    }, 0);
  }

  show() {
    this.isCollapse = false;
    this.isCollapsing = true;

    this.isExpanded = true;
    this.isCollapsed = false;
    setTimeout(() => {
      this.height = 'auto';
      this.opacity = '1';
      this.padding = '0.75rem 1.25rem';

      this.isCollapse = true;
      this.isCollapsing = false;
    }, 0);
  }
}
