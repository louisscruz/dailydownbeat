import {Injectable, EventEmitter} from 'angular2/core';
import {AlertNotification} from '../../datatypes/alert/alertnotification';
import {AlertNotifications} from '../../datatypes/alert/mock-alerts';

@Injectable()
export class AlertService {
  public alerts: AlertNotification[];
  constructor() {
    this.alerts = AlertNotifications;
  }
  getAlerts() {
    return Promise.resolve(this.alerts);
  };
  addAlert(alert: AlertNotification) {
    this.alerts.push({
      'message': alert.message,
      'type': alert.type || 'warning',
      'timeout': alert.timeout || 8000,
      'dismissible': alert.dismissible || true
    });
  };
}
