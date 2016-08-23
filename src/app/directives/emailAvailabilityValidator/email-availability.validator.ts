import { Directive, forwardRef, provide, Attribute, Output, EventEmitter } from '@angular/core';
import { Validator, AbstractControl, NG_ASYNC_VALIDATORS} from '@angular/forms';
import { AuthService } from '../../services/auth/authService';

@Directive({
  selector: '[validateEmailAvailability][formControlName], [validateEmailAvailability][formControl], [validateEmailAvailability][ngModel]',
  providers: [
    provide(NG_ASYNC_VALIDATORS, { useExisting: forwardRef(() => EmailAvailabilityValidator), multi: true })
  ]
})

export class EmailAvailabilityValidator implements Validator {
  private emailTimeout;

  @Output() startValidatingEmail = new EventEmitter();
  @Output() stopValidatingEmail = new EventEmitter();

  constructor(
    private _authService: AuthService
  ) {}

  validate(control: AbstractControl): Promise<{ [key: string]: any }> {
    this.startValidatingEmail.emit(control);
    clearTimeout(this.emailTimeout);

    return new Promise((resolve, reject) => {
      clearTimeout(this.emailTimeout);
      if (control.value !== '' && !control.errors) {
        this.emailTimeout = setTimeout(() => {
          let email = control.value;
          this._authService.checkEmailAvailability(email).subscribe(
            res => {
              if (res["is_valid"] === false) {
                resolve({ validateEmailAvailability: false });
              } else {
                resolve(null);
              }
              this.stopValidatingEmail.emit(control);
            }, err => {}
          )
        }, 1000);
      } else {
        this.stopValidatingEmail.emit(control);
        resolve(null);
      }
    });
  }
}
