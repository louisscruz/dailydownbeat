import {Component, Input, Output, EventEmitter, HostBinding, OnInit} from 'angular2/core';

import {ModalService} from '../services/modal/modalService';

@Component({
  selector: 'modal',
  providers: [],
  template: require('./modal.html'),
  styles: [ require('./modal.scss') ]
})
export class Modal {
  constructor(
    private _modalService: ModalService
  ) {}
}
