// Set timeout to 0 to prevent a timeout being set.

export class AlertNotification {
  constructor(
    public message: string,
    public type: string = 'warning',
    public timeout: number = 0,
    public dismissible: boolean = true
  ) { }
}
