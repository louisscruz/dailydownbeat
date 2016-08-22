import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Modal, BS_MODAL_PROVIDERS } from 'angular2-modal/plugins/bootstrap';

import { terms } from '../modal/modalPresets';

@Component({
  selector: 'footer',
  styles: [ require('./footer.scss') ],
  directives: [ ROUTER_DIRECTIVES ],
  template: require('./footer.html')
})

export class Footer {
  constructor(private modal: Modal) {}

  openTermsModal() {
    let preset = terms(this.modal);
    let dialog = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        res => {},
        err => {}
      )
    });
  }
}
