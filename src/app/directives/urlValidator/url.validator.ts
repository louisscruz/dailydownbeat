import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl } from '@angular/forms';

function validateUrlFactory(/*emailBlackList: EmailBlackList*/) {
  return (c: FormControl) => {
    let URL_REGEXP = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    if (c.value.length > 0 && !URL_REGEXP.test(c.value)) {
      return { invalidUrl: true }
    }
  }
}

@Directive({
  selector: '[validateUrl][ngModel], [validateUrl][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => UrlValidator), multi: true }
  ]
})
export class UrlValidator {

  validator: Function;

  constructor(/*emailBlacklist: EmailBlackList*/) {
    this.validator = validateUrlFactory(/*emailBlackList*/);
  }

  validate(c: FormControl) {
    return this.validator(c);
  }
}
