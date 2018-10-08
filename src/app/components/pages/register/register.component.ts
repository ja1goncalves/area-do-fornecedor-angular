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

  public accessForm: FormGroup;
  public personalDataForm: FormGroup;
  public isValidToken: boolean;
  public UFS: any = ufs;
  public BANKS: any = banks;
  public userName: string;
  public userCpf: string;

  access = {
    email: '',
    name: '',
    cpf: '',
    password: '',
    passwordConfirmation: ''
  }

  // registrationData = {
  //   personalData: {
  //     name: '',
  //     cpf: '',
  //     birthday: '',
  //     gender: '',
  //     phone: '',
  //     mobile: ''
  //   },
  //   residentialData: {
  //     zip_code: '',
  //     street: '',
  //     number: '',
  //     complement: '',
  //     district: '',
  //     city: '',
  //     state: 'AC'
  //   },
  //   commercialData: {
  //     role: '',
  //     profesion: '',
  //     company: '',
  //     phone: ''
  //   }
  // }

  // fidelityProgramsData = {
  //   jj_number: '',
  //   jj_password: '',
  //   g3_number: '',
  //   ad_number: '',
  //   av_number: '',
  // }

  // bankAccountData = {
  //   bank_name: '',
  //   type_account: '',
  //   segment: '',
  //   agency_number: '',
  //   agency_expire_date: '',
  //   account_number: '',
  //   account_expire_date: '',
  // }

  public requestData: any = {
    personal: {
      birthday: '',
      gender: '',
      phone: '',
      cellphone: '',
      occupation: '',
      provider_ocuppation_id: 1,
      company: '',
      company_phone: '' 
    },  
    address: {
      zip_code: '',
      address: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '' 
    },  
    fidelities: [
      {
        program_id: '',
        card_number: '',
        access_password: '' 
      }
    ],  
    bank: {
      bank_id: '',
      type: '',
      segment_id: '',
      agency: '',
      agency_digit: '',
      account: '',
      account_digit: '',
      operation: 123
    }
  }


  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private register: RegisterService,
    private login: AuthService) {}

  createRegister(stepper: any): any {
    const requestData = {
      email: this.access.email,
      password: this.access.password,
      cpf: this.access.cpf,
      name: this.access.name
    };
    this.register.createRegister(requestData)
     .subscribe((res) => {
        stepper.next();
     }, (err) => {
        console.log('cr err', err)
     });
  }

  checkConfirm(stepper: any): any {
    this.login.loginUser(this.access.email, this.access.password)
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
    this.userName = request['name'];
    this.userCpf = request['cpf'];
  }

  nextStep(stepper: any): any {
    stepper.next();
  }
  
  concludeRegister(): any {
    
  }

  ngOnInit() {
    this.accessForm = this._formBuilder.group({
      access_email: ['', Validators.required],
      access_name: ['', Validators.required],
      access_cpf: ['', Validators.required],
      access_password: ['', Validators.required],
      access_passwordConfirmation: ['', Validators.required]
    });

    this.route.params
     .subscribe((res) => {
      this.register.checkToken(res.code)
       .subscribe((res) => {
         this.access.email = res.data.email;
       }, (err) => {
         console.log(err)
       })
     }, (err) => {
      console.log(err)
     })
  }
  
}
