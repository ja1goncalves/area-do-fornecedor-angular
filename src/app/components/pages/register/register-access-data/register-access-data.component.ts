import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PasswordValidation } from 'src/app/helpers/validators';
import { AccessData } from 'src/app/models/register-data';
import { RegisterService } from 'src/app/services/register/register.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-access-data',
  templateUrl: './register-access-data.component.html',
  styleUrls: ['./register-access-data.component.css']
})
export class RegisterAccessDataComponent implements OnInit {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() accessDataForm: FormGroup;

  public accessData: AccessData;

  constructor(private fb: FormBuilder, private register: RegisterService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.accessDataForm = this.fb.group({
      email:            [{value: '', disabled: true}, [Validators.required]],
      name:             ['', [Validators.required]],
      cpf:              ['', [Validators.required]],
      password:         ['', [Validators.required]],
      confirmPassword:  ['', [Validators.required]],
    }, {validator: PasswordValidation.MatchPassword});

    this.route.params.subscribe(
      (params: any) => {
        this.checkToken(params.token);
      },
      (err) => { }
    );

  }

  public checkToken(token: string): void {
    this.register.checkToken(token).subscribe(
      (tokenInfo: any) => {
        this.accessDataForm.controls.email.setValue(tokenInfo.email);
      },
      (err) => { }
    );
  }

  accessDataSubmit(): void {

    if (this.accessDataForm.valid) {
      this.accessData = {
        email: this.accessDataForm.controls.email.value,
        name: this.accessDataForm.controls.name.value,
        cpf: this.accessDataForm.controls.cpf.value,
        password: this.accessDataForm.controls.password.value,
      };

      this.submitData.emit(this.accessData);
    }

  }
}
