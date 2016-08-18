import { Injectable } from '@angular/core';
import { AlertNotification } from '../../datatypes/alert/alertnotification';
import { AlertNotifications } from '../../datatypes/alert/mock-alerts';

@Injectable()
export class AlertService {
  public alerts: AlertNotification[];

  constructor() {
    this.alerts = AlertNotifications;
  }

  getAlerts() {
    return Promise.resolve(this.alerts);
  }

  addAlert(alert: AlertNotification) {
    this.alerts.push({
      'message': alert.message,
      'type': alert.type,
      'timeout': alert.timeout,
      'dismissible': alert.dismissible
    });
  }
}
