import {Component} from 'angular2/core';
import {Alert} from 'ng2-bootstrap/ng2-bootstrap';
import {AlertNotification} from '../assets/alertnotification';

@Component({
  selector: 'alerts',
  directives: [Alert],
  styles: [ require('./alerts.scss') ],
  template: require('./alerts.html')
})

export class Alerts {
  alerts = [
    new AlertNotification('Too early', 'danger'),
    new AlertNotification('Too Late', 'success')
  ];
}
