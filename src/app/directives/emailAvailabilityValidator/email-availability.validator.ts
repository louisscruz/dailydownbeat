import { Directive, forwardRef, provide, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS} from '@angular/forms';
import { AuthService } from '../../services/auth/authService';

@Directive({
  selector: '[validateEmailAvailability][formControlName], [validateEmailAvailability][formControl], [validateEmailAvailability][ngModel]',
  providers: [
    provide(NG_VALIDATORS, { useExisting: forwardRef(() => EmailAvailableValidator), multi: true })
  ]
})

export class EmailAvailableValidator implements Validator {
  constructor(
    @Attribute('validateEmailAvailability') public validateEmailAvailability: string
  ) {}

  validate(control: AbstractControl): { [key: string]: any } {

    return null;
  }

  /*private get isReverse(): boolean {
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
  }*/
}
