import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidation } from 'src/app/helpers/validators';

@Component({
  selector: 'app-register-access-data',
  templateUrl: './register-access-data.component.html',
  styleUrls: ['./register-access-data.component.css']
})
export class RegisterAccessDataComponent implements OnInit {

  public accessDataForm: FormGroup;

  constructor(private fb: FormBuilder) { 
    this.accessDataForm = this.fb.group({
      email:            ['umbertobarrosf@gmail.com', [Validators.required]],
      name:             ['', [Validators.required]],
      cpf:              ['', [Validators.required]],
      password:         ['', [Validators.required]],
      confirmPassword:  ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.accessDataForm.controls.email.disable();
    console.log(this.accessDataForm);

  }


  personalDataSubmit() {
    console.log(this.accessDataForm)

    if(this.accessDataForm.valid && this.accessDataForm.value.password != this.accessDataForm.value.confirmPassword) {
      alert('Senhas diferentes'); 
      return;
    }
    
    console.log(this.accessDataForm)

  }
}
