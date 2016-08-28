import { Component, ViewEncapsulation } from '@angular/core';

import { AppState } from '../app.service';

@Component({
  selector: 'about',
  template: require('./about.html'),
  styles: [ require('./about.scss') ],
})

export class About {
  constructor(
    private appState: AppState
  ) {}

  ngOnInit() {
    this.appState.removeContainer = true;
  }

  ngOnDestroy() {
    this.appState.removeContainer = false;
  }
}
