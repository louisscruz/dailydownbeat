import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, FormControl, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[customRequired][ngModel], [customRequired][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => RequiredValidator), multi: true }
  ]
})
export class RequiredValidator {
  private control: AbstractControl;

  @Input('customRequired') customRequired: boolean

  ngOnChanges() {
    if (this.control) {
      this.control.updateValueAndValidity();
    }
  }

  validate(control: AbstractControl): { [key: string]: any } {
    console.log(control.value)
    this.control = control;
    if (this.customRequired && control.value === '') {
      return { required: true }
    }
  }
}
