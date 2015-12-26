import {Injectable} from 'angular2/core';
import {AlertNotification} from '../../datatypes/alert/alertnotification';
import {AlertNotifications} from '../../datatypes/alert/mock-alerts';

@Injectable()
export class AlertService {
  getAlerts() {
    return Promise.resolve(AlertNotifications);
  }
  addAlert() {
    
  }
}
