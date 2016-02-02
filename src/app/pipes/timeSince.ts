import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'timeSince'})

export class TimeSincePipe implements PipeTransform {
  transform(date: any): string {
    let now = new Date();
    let then = new Date(date);
    var diff = (now.getTime() - then.getTime()) / 1000;
    var result = '';

    if (diff < 60) {
      result = 'less than 1 minute';
    } else {
      diff /= 60;
      if (diff < 60) {
        result = Math.floor(diff).toString().concat(' minutes');
      } else {
        diff /= 60;
        if (diff < 24) {
          result = Math.floor(diff).toString().concat(' hours');
        } else {
          diff /= 24;
          if (diff < 7) {
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
    return result.concat(' ago');
  }
}
