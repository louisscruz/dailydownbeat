import {Component, OnInit} from 'angular2/core';
import {Alert} from '../directives/alert/alert';
import {AlertNotification} from '../datatypes/alert/alertnotification';
import {AlertService} from '../services/alerts/alertsService.ts';

@Component({
  selector: 'alerts',
  directives: [Alert],
  styles: [ require('./alerts.scss') ],
  template: require('./alerts.html'),
  providers: []
})

/*export class Alerts {
  private alerts: AlertNotification[];
  constructor(private _alertService: AlertService) {
    this.alerts = this._alertService.getAlerts();
  }

  private onAlertAdded(alert: AlertNotification): void {
    console.log(alert);
    this.alerts.push(alert);
  }
}*/

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
