import { Directive, forwardRef, provide, Attribute, Output, EventEmitter } from '@angular/core';
import { Validator, AbstractControl, NG_ASYNC_VALIDATORS} from '@angular/forms';
import { AuthService } from '../../services/auth/authService';
import { Observable } from 'rxjs/Observable';

@Directive({
  selector: '[validateEmailAvailability][formControlName], [validateEmailAvailability][formControl], [validateEmailAvailability][ngModel]',
  providers: [
    provide(NG_ASYNC_VALIDATORS, { useExisting: forwardRef(() => EmailAvailabilityValidator), multi: true })
  ]
})

export class EmailAvailabilityValidator implements Validator {
  private emailTimeout;

  @Output() startValidatingEmail = new EventEmitter(true);
  @Output() stopValidatingEmail = new EventEmitter(true);

  constructor(
    private _authService: AuthService
  ) {}

  validate(control: AbstractControl): Promise<{ [key: string]: any }> {
    //this.startValidatingEmail.emit(control);

    return new Promise((resolve, reject) => {
      clearTimeout(this.emailTimeout);
      if (control.value !== '' && !control.errors) {
        this.emailTimeout = setTimeout(() => {
          let email = control.value.toLowerCase();
          this._authService.checkEmailAvailability(email).subscribe(
            res => {
              if (res["is_valid"] === false) {
                //this.stopValidatingEmail.emit(control);
                resolve({ validateEmailAvailability: false });
              } else {
                //this.stopValidatingEmail.emit(control);
                resolve(null);
              }
            }, err => {
              //this.stopValidatingEmail.emit(control);
            }
          )
        }, 1000);
      } else {
        resolve(null);
      }
    });
  }
}
