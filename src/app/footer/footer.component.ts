import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Modal, BS_MODAL_PROVIDERS } from 'angular2-modal/plugins/bootstrap';

import { guidelines, terms } from '../modal/modalPresets';

@Component({
  selector: 'footer',
  styles: [ require('./footer.scss') ],
  directives: [ ROUTER_DIRECTIVES ],
  template: require('./footer.html')
})

export class Footer {
  private copyrightText: string;

  constructor(private modal: Modal) {}

  openGuidelinesModal() {
    let preset = guidelines(this.modal);
    let dialog = preset.open();
    dialog.then((resultPromise) => {
      return resultPromise.result
      .then(
        res => {},
        err => {}
      )
    })
  }

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

  ngOnInit() {
    let startYear = 2016;
    let currentYear = new Date().getFullYear();
    this.copyrightText = 'Copyright &copy; Daily Downbeat ' + startYear.toString();
    if (currentYear > startYear) {
      this.copyrightText += (' - ' + currentYear.toString());
    }
    this.copyrightText += '.';
  }
}
