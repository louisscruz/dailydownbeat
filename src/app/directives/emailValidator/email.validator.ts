import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl } from '@angular/forms';

function validateEmailFactory(/*emailBlackList: EmailBlackList*/) {
  return (c: FormControl) => {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (c.value.length > 0 && !EMAIL_REGEXP.test(c.value)) {
      return { invalidEmail: true }
    }
  }
}

@Directive({
  selector: '[validateEmail][ngModel], [validateEmail][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidator), multi: true }
  ]
})
export class EmailValidator {

  validator: Function;

  constructor(/*emailBlacklist: EmailBlackList*/) {
    this.validator = validateEmailFactory(/*emailBlackList*/);
  }

  validate(c: FormControl) {
    return this.validator(c);
  }
}
