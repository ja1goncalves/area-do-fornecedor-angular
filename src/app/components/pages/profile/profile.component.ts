import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RegisterService } from '../../../services/register/register.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UFS, OCCUPATIONS } from 'src/app/config/consts';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public ufs: any = UFS;
  public occupations: any = OCCUPATIONS;
  public banks: any = [];
  public segments: any = [];
  public programs: any = [];

  public initialValues: any = {};
  public updateForm: FormGroup;
  public userData: any = {};
  public fidelitiesData: any = [];
  public providerData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private register: RegisterService,
    private auth: AuthService) { }

  ngOnInit() {
    this.getUserData();
    this.getProviderData();
    this.initForm();
    this.getBanks();
    this.getPrograms();
  }

  get f() { return this.updateForm.controls; }

  public initForm(): void {
    this.updateForm = this.formBuilder.group({
      address: ['', []],
      city: ['', []],
      complement: ['', []],
      neighborhood: ['', []],
      number: ['', []],
      state: ['', []],
      zip_code: ['', []],
      account: ['', []],
      account_digit: ['', []],
      agency: ['', []],
      agency_digit: ['', []],
      bank_id: ['', []],
      operation: ['', []],
      segment_id: ['', []],
      type: ['', []],
      name: [{value:  '', disabled: true }, []],
      cpf: [{value:  '', disabled: true }, []],
      birthday: [{value:  '', disabled: true }, [Validators.required]],
      cellphone: ['', [Validators.required]],
      company: ['', []],
      company_phone: ['', []],
      gender: ['', [Validators.required]],
      occupation: ['', []],
      phone: ['', []],
      provider_occupation_id: ['', []],
    })
  }

  public fillForm(providerData) {
    Object.keys(providerData).forEach(data => {
      if(this.updateForm.controls[data]) {
        this.updateForm.controls[data].setValue(providerData[data]);
      }
    });
  };

  public getBanks() {
    this.register.getBanks().subscribe(
      (banks) => { this.banks = banks; },
      (error) => { }
    );
  }

  public getSegments() {
    const bank_id = this.f.bank_id.value;
    this.register.getSegments(bank_id).subscribe(
      (segments) => { this.segments = segments; },
      (error) => { }
    );
  }

  public getPrograms() {
    this.register.getPrograms().subscribe(
      (programs) => { this.programs = programs; },
      (error) => { }
    );
  }

  public getUserData():void {
    this.auth.getUserAuthenticated().subscribe(
      (userData) => {
        this.userData['name'] = userData['name'];
        this.userData['cpf'] = userData['cpf'];
      },
      (error) => { }
    );
  }

  public getProviderData(): void {
    this.register.getProviderData().subscribe(
      (providerData) => {
        this.initialValues = providerData;
        this.mountProgramsControls();
        this.providerData = {...providerData.address, ...providerData.bank, ...providerData.personal, ...this.userData };
        this.providerData['birthday'] = moment(this.providerData['birthday']).format('DD/MM/YYYY');
        this.fillForm(this.providerData);
      },
      (error) => { console.log(error); }
    );
  }

  public getProgramInfo(id: number): void {
    this.register.getProgramInfo(id).subscribe(
      (program) => {
        
      },
      (error) => { console.log(error); }
    );
  }

  public mountProgramsControls(): void {
    this.programs.forEach((program) => {
      this.updateForm.addControl(`card_number_${program['code']}`, new FormControl('', []));
      if(program['code'] === 'JJ') {
        this.updateForm.addControl(`access_password_${program['code']}`, new FormControl('', []));
      }

      this.initialValues.fidelities.forEach(fidelity => {
        if(fidelity['program_id'] === program.id) {
          this.f[`card_number_${program['code']}`].setValue(fidelity['card_number']);

          if(program['code'] === 'JJ') {
            this.f[`access_password_${program['code']}`].setValue(fidelity['access_password']);
          }  
        }
      });       
    });
  }

  public mountRequestData(): any {
    const requestData = {}
    const values = this.updateForm.value;
    const fidelities = [];
    
    requestData['address'] = {
      address: values.address,
      city: values.city,
      complement: values.complement,
      neighborhood: values.neighborhood,
      number: values.number,
      state: values.state,
      zip_code: values.zip_code
    }

    requestData['bank'] = {
      account: values.account,
      account_digit: values.account_digit,
      agency: values.agency,
      agency_digit: values.agency_digit,
      bank_id: values.bank_id,
      operation: values.operation,
      segment_id: values.segment_id,
      type: values.type
    }

    requestData['personal'] = {
      birthday: moment(values.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      cellphone: values.cellphone,
      company: values.company,
      company_phone: values.company_phone,
      gender: values.gender,
      occupation: values.occupation,
      phone: values.phone,
      provider_occupation_id: values.provider_occupation_id
    }


    this.programs.forEach((program, index) => {
      if(values[`card_number_${program.code}`]) {
        let fidelity = {};
        fidelity['card_number'] = values[`card_number_${program.code}`];
        fidelity['access_password'] = null;
        fidelity['program_id'] = program.id;

        this.initialValues.fidelities.forEach((initial_fidelity) => {
          if(initial_fidelity['program_id'] === program.id) {
            fidelity['id'] = initial_fidelity.id;
          }
        });

        if(program.code === 'JJ') {
          fidelity['access_password'] = values[`access_password_${program.code}`];;
        }

        fidelities.push(fidelity);
      }
    }); 
    
    requestData['fidelities'] = fidelities;
    
    return requestData;
    
  }

  public submitForm():void {
    const requestData = this.mountRequestData();
    this.mountRequestData();
    this.register.updateRegister(requestData).subscribe(
      (response) => { console.log(response); },
      (error) => { console.log(error); }
    );
  }

}
