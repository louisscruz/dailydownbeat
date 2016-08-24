import { Directive, forwardRef, provide, Attribute, Output, EventEmitter } from '@angular/core';
import { Validator, AbstractControl, NG_ASYNC_VALIDATORS} from '@angular/forms';
import { AuthService } from '../../services/auth/authService';

@Directive({
  selector: '[validateUsernameAvailability][formControlName], [validateUsernameAvailability][formControl], [validateUsernameAvailability][ngModel]',
  providers: [
    provide(NG_ASYNC_VALIDATORS, { useExisting: forwardRef(() => UsernameAvailabilityValidator), multi: true })
  ]
})

export class UsernameAvailabilityValidator implements Validator {
  private usernameTimeout;

  constructor(
    private _authService: AuthService
  ) {}

  validate(control: AbstractControl): Promise<{ [key: string]: any }> {

    return new Promise((resolve, reject) => {
      clearTimeout(this.usernameTimeout);
      if (control.value !== '' && !control.errors) {
        this.usernameTimeout = setTimeout(() => {
          let username = control.value;
          this._authService.checkUsernameAvailability(username).subscribe(
            res => {
              if (res["is_valid"] === false) {
                resolve({ validateUsernameAvailability: false });
              } else {
                resolve(null);
              }
            }, err => {
            }
          )
        }, 1000);
      } else {
        resolve(null);
      }
    });
  }
}
