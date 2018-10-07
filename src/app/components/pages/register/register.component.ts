import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../../services/register/register.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isLinear = true;
  accessDataForm: FormGroup;
  personalDataForm: FormGroup;
  isValidToken: boolean;

  accessData = {
    email: '',
    name: '',
    cpf: '',
    password: '',
    passwordConfirmation: ''
  }

  registrationData = {
    personalData: {
      name: '',
      cpf: '',
      birthday: '',
      gender: '',
      phone: '',
      mobile: ''
    },
    residentialData: {
      zip_code: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: ''
    },
    commercialData: {
      role: '',
      profession: '',
      company_name: '',
      phone: ''
    }
  }

  fidelityProgramsData = {
    jj_number: '',
    jj_password: '',
    g3_number: '',
    ad_number: '',
    av_number: '',
  }

  bankAccountData = {
    bank_name: '',
    type_account: '',
    segment: '',
    agency_number: '',
    agency_expire_date: '',
    account_number: '',
    account_expire_date: '',
  }

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private register: RegisterService,
    private login: AuthService) {}

  createRegister(stepper: any): any {
    const requestData = {
      email: this.accessData.email,
      password: this.accessData.password,
      cpf: this.accessData.cpf,
      name: this.accessData.name
    };
    this.register.createRegister(requestData)
     .subscribe((res) => {
        // console.log('cr', res);
        stepper.next();
     }, (err) => {
        console.log('cr err', err)
     });
  }

  checkConfirm(stepper: any): any {
    this.login.loginUser(this.accessData.email, this.accessData.password)
     .subscribe((res) => {
        this.login.getUserAuthenticated()
        .subscribe((res) => {
          this.setUserData(res);
        }, (err) => {
          console.log(err);
        })
        stepper.next();
     }, (err) => {
      console.log('confirm err', err)
     })
  }

  setUserData(request: object): void {
    this.registrationData.personalData.name = request['name'];
    this.registrationData.personalData.cpf = request['cpf'];
  }


  ngOnInit() {
    this.accessDataForm = this._formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required]
    });

    this.personalDataForm = this._formBuilder.group({
      personal_name: ['', Validators.required]
    });

    this.route.params
     .subscribe((res) => {
      this.register.checkToken(res.code)
       .subscribe((res) => {
         this.accessData.email = res.data.email;
       }, (err) => {
         console.log(err)
       })
     }, (err) => {

     })
  }

}
