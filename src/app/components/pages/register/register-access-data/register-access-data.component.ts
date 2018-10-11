import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PasswordValidation } from 'src/app/helpers/validators';
import { AccessData } from 'src/app/models/register-data';

@Component({
  selector: 'app-register-access-data',
  templateUrl: './register-access-data.component.html',
  styleUrls: ['./register-access-data.component.css']
})
export class RegisterAccessDataComponent implements OnInit {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  public accessData: AccessData;
  @Input() accessDataForm: FormGroup;

  constructor(private fb: FormBuilder) { 
  
  }

  ngOnInit() {
    
    this.accessDataForm = this.fb.group({
      email:            [{value: 'umbertobarrosf@gmail.com', disabled: true}, [Validators.required]],
      name:             ['', [Validators.required]],
      cpf:              ['', [Validators.required]],
      password:         ['', [Validators.required]],
      confirmPassword:  ['', [Validators.required]],
    }, {validator: PasswordValidation.MatchPassword});
  }


  accessDataSubmit() {
    if(this.accessDataForm.valid){
      this.accessData = {
        email: this.accessDataForm.controls.email.value,
        name: this.accessDataForm.controls.name.value,
        cpf: this.accessDataForm.controls.cpf.value,
        password: this.accessDataForm.controls.password.value,
        confirmPassword: this.accessDataForm.controls.confirmPassword.value,
      }
  
      this.submitData.emit(this.accessData);
      console.log(1);
      
    }else{
      console.log(0);
      
    }



  }
}
