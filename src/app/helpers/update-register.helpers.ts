import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../services/register/register.service';
import { AuthService } from '../services/auth/auth.service';
import { UFS, OCCUPATIONS, GENDERS } from '../config/consts';

@Injectable({
    providedIn: 'root'
})
export class updateRegisterHelpers implements OnInit {
  
    public accessForm: FormGroup;
    public bankForm: FormGroup;
    public fidelitiesForm: FormGroup;
    public personalForm: FormGroup;
    public isValidToken: boolean;
    public ufs: any = UFS;
    public occupations: any = OCCUPATIONS;
    public genders: any = GENDERS;
    public banks: any;
    public segments: any;
    public userName: string;
    public userCpf: string;
    public fidelities: any = [];
    public programs: any[] = [];
  
    access = {
      email: '',
      name: '',
      cpf: '',
      password: '',
      passwordConfirmation: ''
    }
  
    public requestData: any = {
      personal: {
        birthday: '',
        gender: '',
        phone: '',
        cellphone: '',
        occupation: '',
        provider_occupation_id: 1,
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
      fidelities: [],  
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
  
  
    getUserAuthenticated(): void {
      this.login.getUserAuthenticated().subscribe(
        (userAuthenticated) => {
          this.setUserData(userAuthenticated);
          this.getBanks();
          this.getPrograms();
        }, 
        (err) => { }
      )
    }
  
    setUserData(request: object): void {
      this.userName = request['name'];
      this.userCpf = request['cpf'];
    }
    
    concludeRegister(): void {
      this.requestData.fidelities = this.fidelities.filter(fidelity => fidelity.card_number.length);
      this.register.updateRegister(this.requestData).subscribe(
        (updatedData) => { },
        (err) => { }
      );
    }
  
    getBanks(): void {
      this.register.getBanks().subscribe(
        (banks) => {
          this.banks = banks;
        },
        (err) => { }
      )
    }

    getSegmentsByBank(bank_id: number):void {
      this.register.getSegmentsByBank(bank_id).subscribe(
        (segments) => {
          this.segments = segments;
        },
        (err) => { }
      )
    }
  
    getPrograms(): void {
      this.register.getPrograms().subscribe(
        (programs) => {
          this.programs = programs.filter(program => !['TRB', 'G3D'].includes(program.code));
  
          for(const program of this.programs) {
            this.fidelities.push({program_id: program.id, card_number: '', access_password: ''});
          }
  
        },
        (err) => { }
      )
    }
  
    ngOnInit() {
  
      this.accessForm = this._formBuilder.group({
        access_email: ['', Validators.required],
        access_name: ['', Validators.required],
        access_cpf: ['', Validators.required],
        access_password: ['', Validators.required],
        access_passwordConfirmation: ['', Validators.required]
      });
  
      this.bankForm = this._formBuilder.group({
        bank_bank_id: [''],
        bank_type: [''],
        bank_segment_id: [''],
        bank_agency: [''],
        bank_agency_digit: [''],
        bank_account: [''],
        bank_account_digit: ['']
      });
  
      this.personalForm = this._formBuilder.group({
        personal_name: [''],
        personal_cpf: [''],
        personal_birthday: [''],
        personal_gender: [''],
        personal_phone: [''],
        personal_cellphone: [''],
        personal_occupation: [''],
        personal_occupation_id: [''],
        personal_company: [''],
        personal_company_phone: [''],
        residential_zip_code: [''],
        residential_address: [''],
        residential_number: [''],
        residential_complement: [''],
        residential_neighborhood: [''],
        residential_city: [''],
        residential_state: [''],
      });
  
    }
   
}
