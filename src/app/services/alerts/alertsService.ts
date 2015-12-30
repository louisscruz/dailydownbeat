import {Injectable} from 'angular2/core';
import {AlertNotification} from '../../datatypes/alert/alertnotification';
import {AlertNotifications} from '../../datatypes/alert/mock-alerts';

@Injectable()
export class AlertService {
  alerts: any;
  constructor() {
    this.alerts = AlertNotifications;
  }
  getAlerts() {
    return Promise.resolve(this.alerts);
  }
  addAlert(message: string, type: string = 'warning') {
    this.alerts.push({'message': message, 'type': type});
  }
}
