import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[validateUrl][ngModel], [validateUrl][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => UrlValidator), multi: true }
  ]
})
export class UrlValidator {

  validate(control: AbstractControl): { [key: string]: any } {
    let URL_REGEXP = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if ((control.value && control.value.length > 0) && !URL_REGEXP.test(control.value)) {
      return { invalidUrl: true }
    }
  }
}
