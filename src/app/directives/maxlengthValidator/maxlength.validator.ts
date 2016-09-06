import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, FormControl, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[customMaxlength][ngModel], [customMaxlength][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxlengthValidator), multi: true }
  ]
})
export class MaxlengthValidator {
  constructor(
    @Attribute('customMaxlength') public customMaxlength: string
  ) {}

  validate(control: AbstractControl): { [key: string]: any } {
    if (control.value.length > this.customMaxlength) {
      return { maxlength: true }
    }
  }
}
