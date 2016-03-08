import {Injectable, EventEmitter} from 'angular2/core';

import {Modal} from '../../datatypes/modal/modal';

@Injectable()
export class ModalService {
  public modal: Modal = {
    title: 'test',
    type: 'thing'
  };
  public open: boolean = false;
  constructor() {}
  getAlerts() {
  };
  setModal(modal) {
  };
  openModal() {
    this.open = true;
  };
}
