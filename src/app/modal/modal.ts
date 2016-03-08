import {Component, View, Input, Output, EventEmitter, OnInit} from 'angular2/core';

import {ModalService} from '../services/modal/modalService';

@Component({
  selector: 'modal',
  providers: [ModalService]
})
@View({
  template: require('./modal.html')
})
export class Modal {
  constructor(
    private _modalService: ModalService
  ) {}
}
