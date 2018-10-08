import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../../services/register/register.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ufs, banks } from '../../../config/consts';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  accessDataForm: FormGroup;
  personalDataForm: FormGroup;
  isValidToken: boolean;
  UFS: any = ufs;
  BANKS: any = banks;

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
      state: 'AC'
    },
    commercialData: {
      role: '',
      profesion: '',
      company: '',
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

  nextStep(stepper: any): any {
    console.log(this.bankAccountData, this.registrationData)
    stepper.next();
  }
  
  concludeRegister(): any {
    
  }

  ngOnInit() {
    this.accessDataForm = this._formBuilder.group({
      accessData_email: ['', Validators.required],
      accessData_name: ['', Validators.required],
      accessData_cpf: ['', Validators.required],
      accessData_password: ['', Validators.required],
      accessData_passwordConfirmation: ['', Validators.required]
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
      console.log(err)
     })
  }
  
}
