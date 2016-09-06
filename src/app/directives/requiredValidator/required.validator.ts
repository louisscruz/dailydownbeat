import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, FormControl, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[customRequired][ngModel], [customRequired][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => RequiredValidator), multi: true }
  ]
})
export class RequiredValidator {
  constructor(
    @Attribute('customRequired') public customRequired: string
  ) {}

  validate(control: AbstractControl): { [key: string]: any } {
    if (this.customRequired && control.value === '') {
      return { required: true }
    }
  }
}
