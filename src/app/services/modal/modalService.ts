import {Injectable, EventEmitter} from 'angular2/core';

import {Modal} from '../../datatypes/modal/modal';

@Injectable()
export class ModalService {
  //public modal: Modal = {};
  public modal: Modal = {
    title: 'something',
    body: 'Are you sure?',
    confirmText: 'Confirm',
    type: 'warning'
  }
  public showModal: boolean = false;
  constructor() {}
  getModal() {
    return this.modal;
  };
  setModal(modal): void {
    this.modal = modal;
  };
  destroyModal(): void {
    this.modal = null;
  };
  openModal() {
    this.showModal = true;
  };
  closeModal() {
    this.showModal = false;
    this.destroyModal();
  };
  setAndOpenModal(modal) {
    this.setModal(modal);
    this.showModal = true;
  }
}
