import {Component} from 'angular2/core';
import {CORE_DIRECTIVES,
        FORM_DIRECTIVES,
        FormBuilder,
        ControlGroup,
        Validators,
        AbstractControl,
        Control} from 'angular2/common';

@Component({
  selector: 'donate',
  template: require('./donate.html')
})

export class Donate {
  private donateForm: ControlGroup;
  private number: AbstractControl;
  private email: AbstractControl;
  constructor(private _fb: FormBuilder) {
    function emailValidator(control: Control): { [s: string]: boolean } {
      if (!control.value.match(/.+@.+\..+/i) && control.value) {
        return {invalidEmail: true};
      }
    }
    this.donateForm = _fb.group({
      'number': ['', Validators.compose([
        Validators.required
      ])],
      'email': ['', Validators.compose([
        Validators.required, emailValidator
      ])]
    });
    this.number = this.donateForm.controls['number'];
    this.email = this.donateForm.controls['email'];
  }
}
