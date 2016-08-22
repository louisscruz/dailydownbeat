import { Directive, forwardRef, provide, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS} from '@angular/forms';

@Directive({
  selector: '[validateEquals][formControlName], [validateEquals][formControl], [validateEquals][ngModel]',
  providers: [
    provide(NG_VALIDATORS, { useExisting: forwardRef(() => EqualsValidator), multi: true })
  ]
})

export class EqualsValidator implements Validator {
  constructor(
    @Attribute('validateEquals') public validateEquals: string,
    @Attribute('reverse') public reverse: string
  ) {}

  private get isReverse(): boolean {
    if (!this.reverse) return false;
    return this.reverse === 'true' ? true: false;
  }

  validate(control: AbstractControl): { [key: string]: any } {
    let value = control.value;
    let comparator = control.root.find(this.validateEquals);
    if (!comparator) return null;

    if (value !== comparator.value) {
      if (!this.isReverse) {
        return { validateEquals: false }
      } else {
        comparator.setErrors({ validateEquals: false });
      }
    } else if (comparator.errors && comparator.hasError('validateEquals')) {
      comparator.errors['validateEquals'] = null;
      if (Object.keys(comparator.errors).length == 1) comparator.setErrors(null);
    }
  }
}
