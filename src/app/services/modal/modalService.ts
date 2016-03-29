import {Injectable, EventEmitter} from 'angular2/core';

import {Modal} from '../../datatypes/modal/modal';

@Injectable()
export class ModalService {
  public modal: Modal = {
    title: 'test',
    type: 'thing'
  };
  public showModal: boolean = false;
  constructor() {}
  getAlerts() {
  };
  setModal(modal) {
  };
  openModal() {
    this.showModal = true;
  };
  closeModal() {
    this.showModal = false;
  }
}
