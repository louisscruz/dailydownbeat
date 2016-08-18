import { Component } from '@angular/core';
import { CORE_DIRECTIVES,
         FORM_DIRECTIVES,
         FormBuilder,
         ControlGroup,
         Validators,
         AbstractControl,
         Control } from '@angular/common';

@Component({
  selector: 'contact',
  styles: [require('./contact.scss')],
  template: require('./contact.html')
})
export class Contact {
  private contactForm: ControlGroup;
  private name: AbstractControl;
  private email: AbstractControl;
  private purpose: AbstractControl;
  private body: AbstractControl;
  private purposes: Array<any>;
  constructor(private _fb: FormBuilder) {
    function emailValidator(control: Control): { [s: string]: boolean } {
      if (!control.value.match(/.+@.+\..+/i) && control.value) {
        return {invalidEmail: true};
      }
    }
    this.contactForm = _fb.group({
      'name': ['', Validators.compose([
        Validators.required
      ])],
      'email': ['', Validators.compose([
        Validators.required, emailValidator
      ])],
      'purpose': ['', Validators.compose([
        Validators.required
      ])],
      'body': ['', Validators.compose([
        Validators.required
      ])]
    });
    this.name = this.contactForm.controls['name'];
    this.email = this.contactForm.controls['email'];
    this.purpose = this.contactForm.controls['purpose'];
    this.body = this.contactForm.controls['body'];

    this.purposes = ['Technical Support', 'Suggestion', 'Other']
  }

  ngOnInit() {}

}
