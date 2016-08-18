import { AlertNotification } from './alertnotification';

export let AlertNotifications: AlertNotification[] = [
  new AlertNotification('test', 'danger', 800000),
  new AlertNotification('two', 'warning', 0),
  new AlertNotification('three')
];
