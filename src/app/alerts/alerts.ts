import {Component, OnInit} from 'angular2/core';
import {Alert} from 'ng2-bootstrap/ng2-bootstrap';
import {AlertNotification} from '../datatypes/alert/alertnotification';
import {AlertService} from '../services/alerts/alertsService.ts';

@Component({
  selector: 'alerts',
  directives: [Alert],
  styles: [ require('./alerts.scss') ],
  template: require('./alerts.html'),
  providers: [AlertService]
})

export class Alerts implements OnInit {
  public alerts: AlertNotification[];

  constructor(private _alertService: AlertService) { }

  getAlerts() {
    this._alertService.getAlerts().then(alerts => this.alerts = alerts);
  }

  ngOnInit() {
    this.getAlerts();
  }
}
