export class AlertNotification {
  constructor(
    public message: string,
    public type: string,
    public timeout: number = 8000,
    public dismissible: boolean = true
  ) { }
}
