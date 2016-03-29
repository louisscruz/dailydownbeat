import {Pipe, PipeTransform, ChangeDetectorRef, OnDestroy} from 'angular2/core';

@Pipe({name: 'timeSince', pure: false})

export class TimeSincePipe implements PipeTransform, OnDestroy {
  private _currentTimer: number;

  constructor(private _cdRef: ChangeDetectorRef) {};

  transform(date: any): string {
    this._destroyTimer();
    let result: string;
    let diff = this._diffInTime(date);
    if (diff < 60) {
      result = 'less than 1 minute';
    } else {
      diff /= 60;
      if (diff < 2) {
        result = Math.floor(diff).toString().concat(' minute');
      } else if (diff < 60) {
        result = Math.floor(diff).toString().concat(' minutes');
      } else {
        diff /= 60;
        if (diff < 2) {
          result = Math.floor(diff).toString().concat(' hour');
        } else if (diff < 24) {
          result = Math.floor(diff).toString().concat(' hours');
        } else {
          diff /= 24;
          if (diff < 2) {
            result = Math.floor(diff).toString().concat(' day');
          } else if (diff < 7) {
            result = Math.floor(diff).toString().concat(' days');
          } else {
            diff /= 7;
            if (diff < 2) {
              result = Math.floor(diff).toString().concat(' week');
            } else if (diff < 4) {
              result = Math.floor(diff).toString().concat(' weeks');
            } else {
              diff /= 4;
              if (diff < 2) {
                result = Math.floor(diff).toString().concat(' month');
              } else if (diff < 12) {
                result = Math.floor(diff).toString().concat(' months');
              } else {
                diff /= 12;
                if (diff < 2) {
                  result = Math.floor(diff).toString().concat(' year');
                } else {
                  result = Math.floor(diff).toString().concat(' years');
                }
              }
            }
          }
        }
      }
    }
    let timeToUpdate = this._getSecondsUntilUpdate(diff) * 1000;
    if (timeToUpdate !== 0) {
      this._currentTimer = window.setTimeout(() => this._cdRef.markForCheck(), timeToUpdate);
    }
    return result.concat(' ago');
  }
  ngOnDestroy(): void {
    this._destroyTimer();
  }
  _diffInTime(then) {
    return ((new Date().getTime()) - (new Date(then).getTime())) / 1000;
  }
  _destroyTimer() {
    if (this._currentTimer) {
      window.clearTimeout(this._currentTimer);
      this._currentTimer = null;
    }
  }
  _getSecondsUntilUpdate(diff) {
    if (diff < 1) {
      return 1;
    } else if (diff < 60) {
      return 30;
    } else if (diff < 3600) {
      return 1600;
    } else {
      return 0;
    }
  }
}
