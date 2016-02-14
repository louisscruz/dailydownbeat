import {Injectable, EventEmitter} from 'angular2/core';
import {AlertNotification} from '../../datatypes/alert/alertnotification';
import {AlertNotifications} from '../../datatypes/alert/mock-alerts';

@Injectable()
export class AlertService {
  /*public alertAdded$: EventEmitter<AlertNotification>;
  private alerts: AlertNotification[];
  constructor() {
    this.alerts = AlertNotifications;
    this.alertAdded$ = new EventEmitter();
  }
  public getAlerts() {
    return Promise.resolve(this.alerts);
  }
  public addAlert(message: string, type: string, timeout: number, dismissible: boolean): void {
    let alert = new AlertNotification(message, type, timeout, dismissible);
    this.alerts.push(alert);
    this.alertAdded$.emit(alert);
  }*/
  alerts: AlertNotification[];
  constructor() {
    this.alerts = AlertNotifications;
  }
  getAlerts() {
    return Promise.resolve(this.alerts);
  }
  addAlert(alert: AlertNotification) {
    this.alerts.push({
      'message': alert.message,
      'type': alert.type || 'warning',
      'timeout': alert.timeout || 8000,
      'dismissible': alert.dismissible || true
    });
  }
}
