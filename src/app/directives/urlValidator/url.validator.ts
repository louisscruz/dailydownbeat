import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl, AbstractControl } from '@angular/forms';

const URL_REGEXP = new RegExp('((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)');

@Directive({
  selector: '[validateUrl][ngModel], [validateUrl][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => UrlValidator), multi: true }
  ]
})
export class UrlValidator {

  validate(control: AbstractControl): { [key: string]: any } {
    if ((control.value && control.value.length > 0) && !URL_REGEXP.test(control.value)) {
      return { invalidUrl: true }
    }
  }
}
