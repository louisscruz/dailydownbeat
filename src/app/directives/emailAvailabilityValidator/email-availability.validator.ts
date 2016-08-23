import { Directive, forwardRef, provide, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS} from '@angular/forms';
import { AuthService } from '../../services/auth/authService';

@Directive({
  selector: '[validateEmailAvailability][formControlName], [validateEmailAvailability][formControl], [validateEmailAvailability][ngModel]',
  providers: [
    provide(NG_VALIDATORS, { useExisting: forwardRef(() => EmailAvailabilityValidator), multi: true })
  ]
})

export class EmailAvailabilityValidator implements Validator {
  private emailTimeout;

  constructor(
    @Attribute('validateEmailAvailability') public validateEmailAvailability: string,
    private _authService: AuthService
  ) {}

  validate(control: AbstractControl): { [key: string]: any } {
    /*control.valueChanges.debounceTime(1000).subscribe(newValue => {
      let email = newValue;
      this._authService.checkEmailAvailability(email);

    });
    return null;*/
    if (!control.errors) {
      clearTimeout(this.emailTimeout);
      return new Promise((resolve, reject) => {
        this.emailTimeout = setTimeout(() => {
          let email = control.value;
          this._authService.checkEmailAvailability(email)//.subscribe(
            //res => {},
            //err => {}
          //)
        }, 1000)
      });
    }
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
