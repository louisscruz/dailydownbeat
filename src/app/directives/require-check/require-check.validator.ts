import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl } from '@angular/forms';

@Directive({
  selector: '[requireCheck][ngModel], [requireCheck][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CheckboxValidator), multi: true }
  ]
})
export class CheckboxValidator {

  validate(c: FormControl): { [key: string]: any } {
    if (c.value === false) {
      return { requireCheck: true };
    }
  }
}
