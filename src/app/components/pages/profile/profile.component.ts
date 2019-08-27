import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RegisterService } from '../../../services/register/register.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UFS, OCCUPATIONS, GENDERS } from 'src/app/config/consts';
import { NotifyService } from 'src/app/services/notify/notify.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public ufs: any = UFS;
  public occupations: any = OCCUPATIONS;
  public genders: any = GENDERS;
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
    private auth: AuthService,
    private notify: NotifyService) { }

  async ngOnInit() {
    await this.getUserData();
    await this.getPrograms();
    await this.getBanks();
    await this.initForm();
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
      address_id: ['', []],
      banks_id: ['', []],
    });

    console.log('initForm');
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
      (banks) => {
        this.banks = banks;
        console.log('getBanks');
        },
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
      (programs) => {
          this.programs = programs;
          this.getProviderData();
          console.log('getPrograms');
        },
      (error) => { }
    );
  }

  public getUserData(): void {
    this.auth.getUserAuthenticated().subscribe(
      (userData) => {
        this.userData['name'] = userData['name'];
        this.userData['cpf'] = userData['cpf'];
        console.log('getUserData');
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
        this.providerData['address_id'] = providerData.address ? providerData.address.id : null;
        this.providerData['banks_id'] = providerData.bank ? providerData.bank.id : null;
        this.fillForm(this.providerData);
        console.log('getProviderData');
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
      this.updateForm.addControl(`access_password_${program['code']}`, new FormControl('', []));

      this.initialValues.fidelities.forEach(fidelity => {
        if (fidelity['program_id'] === program.id) {
          this.f[`card_number_${program['code']}`].setValue(fidelity['card_number']);
          this.f[`access_password_${program['code']}`].setValue(fidelity['access_password']);
        }
      });
    });
  }

  public mountRequestData(): any {
    const requestData = {}
    const controls = this.updateForm.controls;
    const fidelities = [];
    
    requestData['address'] = {
      id: controls.address_id.value,
      address: controls.address.value,
      city: controls.city.value,
      complement: controls.complement.value,
      neighborhood: controls.neighborhood.value,
      number: controls.number.value,
      state: controls.state.value,
      zip_code: controls.zip_code.value
    }

    requestData['bank'] = {
      id: controls.banks_id.value,
      account: controls.account.value,
      account_digit: controls.account_digit.value,
      agency: controls.agency.value,
      agency_digit: controls.agency_digit.value,
      bank_id: controls.bank_id.value,
      operation: controls.operation.value,
      segment_id: controls.segment_id.value,
      type: controls.type.value
    }

    requestData['personal'] = {
      birthday: controls.birthday.value,
      cellphone: controls.cellphone.value,
      company: controls.company.value,
      company_phone: controls.company_phone.value,
      gender: controls.gender.value,
      occupation: controls.occupation.value,
      phone: controls.phone.value,
      provider_occupation_id: controls.provider_occupation_id.value
    }

    requestData['personal']['birthday'] = moment(requestData['personal']['birthday'], 'DD/MM/YYYY').format('YYYY-MM-DD');


    this.programs.forEach((program, index) => {
      if(controls[`card_number_${program.code}`].value) {
        let fidelity = {};
        fidelity['card_number'] = controls[`card_number_${program.code}`].value;
        fidelity['access_password'] = null;
        fidelity['program_id'] = program.id;

        this.initialValues.fidelities.forEach((initial_fidelity) => {
          if(initial_fidelity['program_id'] === program.id) {
            fidelity['id'] = initial_fidelity.id;
          }
        });

        // if(program.code === 'JJ') {
          fidelity['access_password'] = controls[`access_password_${program.code}`].value;
        // }

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
      (response) => {
        this.notify.show('success', 'Seus dados foram encaminhados para análise');
      },
      (error) => { console.log(error); }
    );
  }

}
