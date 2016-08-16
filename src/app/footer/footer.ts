import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {
  ModalDialogInstance,
  ModalConfig,
  Modal,
  ICustomModal,
  YesNoModalContent,
  YesNoModal
} from 'angular2-modal/angular2-modal';
import {terms} from '../modal/modalPresets';

@Component({
  selector: 'footer-content',
  styles: [ require('./footer.scss') ],
  directives: [ROUTER_DIRECTIVES],
  providers: [Modal],
  template: require('./footer.html')
})

export class Footer {
  private terms: any;
  constructor(
    private modal: Modal
    //private _modalService: ModalService
  ) {}
  openTermsModal() {
    let preset = terms(this.modal);
    let dialog: Promise<ModalDialogInstance> = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        (res) => {
          console.log('Terms read')
        },
        () => console.log('Error initiating terms modal')
      )
    })
  }

}
