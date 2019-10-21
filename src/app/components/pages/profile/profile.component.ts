import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { RegisterService } from '../../../services/register/register.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UFS, OCCUPATIONS, GENDERS } from 'src/app/config/consts';
import { NotifyService } from 'src/app/services/notify/notify.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { defaultReqErrMessage } from 'src/app/app.utils';
import { RegisterPersonalDataComponent } from '../../pages/register/register-personal-data/register-personal-data.component';
import { RegisterFidelityProgramsComponent } from '../../pages/register/register-fidelity-programs/register-fidelity-programs.component';
import { RegisterBankDataComponent } from '../../pages/register/register-bank-data/register-bank-data.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ],
})
export class ProfileComponent implements OnInit, AfterViewInit {

  @ViewChild(RegisterPersonalDataComponent)
  personalComponent: RegisterPersonalDataComponent;
  @ViewChild(RegisterFidelityProgramsComponent)
  programsComponent: RegisterFidelityProgramsComponent;
  @ViewChild(RegisterBankDataComponent)
  registerComponent: RegisterBankDataComponent;

  // public personalDataForm: FormGroup;
  // public fidelitiesForm: FormGroup;
  // public bankDataForm: FormGroup;
  public userInfo: any = { name: '', cpf: '', cellphone: '' };
  public hasSteps: boolean = false;
  public personalData;

  public ufs: any = UFS;
  public occupations: any = OCCUPATIONS;
  public genders: any = GENDERS;
  public banks: any = [];
  public segments: any = [];
  public programs: any = [];
  public loading: boolean;
  public startDate = new Date(1990, 0, 1);
  public maxDate = new Date();
  public minDate = new Date(this.maxDate.getFullYear() - 150, this.maxDate.getMonth());

  public initialValues: any = {};
  public updateForm: FormGroup;
  public userData: any = {};
  public fidelitiesData: any = [];
  public providerData: any = {};

  public loadingCepData: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private register: RegisterService,
    private auth: AuthService,
    private notify: NotifyService,
    private _adapter: DateAdapter<any>) { }

  async ngOnInit() {
    this._adapter.setLocale('pt');
    (async () => {
      await this.getUserData();
      await this.getPrograms();
      await this.getBanks();
    })()
    // this.initForm();
    this.updateForm = this.formBuilder.group({});
  }

  async ngAfterViewInit() {
    // Adds the formGroup from each component to the father component inside this profile.component.
    this.updateForm.addControl('personalForm', this.personalComponent.personalDataForm);
    this.updateForm.addControl('fidelityForm', this.programsComponent.fidelityDataForm);
    this.updateForm.addControl('bankForm', this.registerComponent.bankDataForm);

    // Sets the father formGroup in the components as the one inside this profile.component.
    this.personalComponent.personalDataForm.setParent(this.updateForm);
    this.programsComponent.fidelityDataForm.setParent(this.updateForm);
    this.registerComponent.bankDataForm.setParent(this.updateForm);
  }

  get f() { return this.updateForm.controls; }

  get personalForm(): FormGroup {
    return this.updateForm.get('personalForm') as FormGroup
  }
  get bankForm(): FormGroup {
    return this.updateForm.get('bankForm') as FormGroup
  }
  get fidelityForm(): FormGroup {
    return this.updateForm.get('fidelityForm') as FormGroup
  }

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
      segment_id: [{ value: '', disabled: true }, []],
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
  }

  public fillForm(providerData) {
    Object.keys(providerData).forEach(data => {
      if (this.updateForm.controls[data]) {
        this.updateForm.controls[data].setValue(providerData[data]);
        if (!this.updateForm.controls[data].value || this.updateForm.controls[data].value === 'Invalid date') {
          this.updateForm.controls[data].enable();
        }
      }
    });
  }

  public getBanks() {
    this.register.getBanks().subscribe(
      (banks) => {
        this.banks = banks;
        },
      (error) => { }
    );
  }

  public getSegment(id) {
    this.register.getSegment(id).subscribe(
        (segment) => {
          this.segments.title = segment.title;
        },
        (error) => { }
    );
  }

  public getSegments(id = 0) {
    const bank_id = this.f.bank_id.value;
    this.register.getSegmentsByBank(bank_id).subscribe(
    (segments) => {
        if (segments.length !== 0) {
          this.updateForm.controls['segment_id'].enable();
          this.segments = segments;
        } else {
          this.updateForm.controls['segment_id'].disable();
          this.segments = [];
        }
      },
      (error) => { }
    );
  }

  public getPrograms() {
    this.register.getPrograms().subscribe(
      (programs) => {
          this.programs = programs;
          this.getProviderData();
        },
      (error) => { }
    );
  }

  public getUserData(): void {
    this.auth.getUserAuthenticated().subscribe(
      ({ name, cpf, birthday, cellphone, gender, phone }) => {
        // { name, cpf, birthday, cellphone, cnpj, gender, phone }
        // console.log('userData: ', u)
        this.personalData = {
          birthday,
          cellphone,
          name,
          cpf,
          gender,
          phone,
        }
        this.userData['name'] = name;
        this.userData['cpf'] = cpf;
      },
      (error) => { }
    );
  }

  public getProviderData(): void {
    this.loading = true;
    this.register.getProviderData().subscribe(
      (providerData) => {
        console.log('providerData: ', providerData);

        this.initialValues = providerData;
        this.mountProgramsControls();
        this.providerData = {...providerData.address, ...providerData.bank, ...providerData.personal, ...this.userData };
        this.providerData['birthday'] = moment(this.providerData['birthday']).format('DD/MM/YYYY');
        this.providerData['address_id'] = providerData.address ? providerData.address.id : null;
        this.providerData['banks_id'] = providerData.bank ? providerData.bank.id : null;
        this.fillForm(this.providerData);
        if (providerData.bank && providerData.bank.segment_id) {
          this.getSegment(providerData.bank.segment_id);
        }
        this.loading = false;
      },
      (error) => { console.log(error); }
    );
  }

  public getProgramInfo(id: number): void {
    this.register.getProgramInfo(id).subscribe(
      (program) => {},
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
    const requestData = {};

    requestData['address'] = {
      // id: this.personalForm.address_id.value,
      id: 0,
      address: this.personalForm.get('residential_address').value,
      city: this.personalForm.get('residential_city').value,
      complement: this.personalForm.get('residential_complement').value,
      neighborhood: this.personalForm.get('residential_neighborhood').value,
      number: this.personalForm.get('residential_number').value,
      state: this.personalForm.get('residential_state').value,
      zip_code: this.personalForm.get('residential_zip_code').value
    };

    requestData['bank'] = {
      id: this.bankForm.get('bank_id').value,
      account: this.bankForm.get('bank_account').value,
      account_digit: this.bankForm.get('bank_account_digit').value,
      agency: this.bankForm.get('bank_agency').value,
      agency_digit: this.bankForm.get('bank_agency_digit').value,
      bank_id: this.bankForm.get('bank_id').value,
      operation: this.bankForm.get('bank_operation').value,
      segment_id: this.bankForm.get('bank_segment_id').value,
      type: this.bankForm.get('bank_type').value
    };

    requestData['personal'] = {
      birthday: this.personalForm.get('personal_birthday').value,
      cellphone: this.personalForm.get('personal_cellphone').value,
      company: this.personalForm.get('personal_company').value,
      company_phone: this.personalForm.get('personal_company_phone').value,
      gender: this.personalForm.get('personal_gender').value,
      occupation: this.personalForm.get('personal_occupation').value, // ?
      phone: this.personalForm.get('personal_phone').value,
      provider_occupation_id: this.personalForm.get('personal_occupation_id').value // ?
    };

    requestData['personal']['birthday'] = moment(requestData['personal']['birthday'], 'DD/MM/YYYY').format('YYYY-MM-DD');

    const { controls } = this.fidelityForm;
    const fidelities = [];

    this.programs.forEach(program => {
      if (controls[`card_number_${program.code}`].value) {
        let fidelity = {};
        fidelity['card_number'] = controls[`card_number_${program.code}`].value;
        fidelity['program_id'] = program.id;

        this.initialValues.fidelities.forEach((initial_fidelity) => {
          if (initial_fidelity['program_id'] === program.id) {
            fidelity['id'] = initial_fidelity.id;
          }
        });
        // if(program.code === 'JJ') {
          fidelity['access_password'] = controls[`access_password_${program.code}`].value || null;
        // }

        fidelities.push(fidelity);
      }
    });

    requestData['fidelities'] = fidelities;

    return requestData;

  }

  public submitForm(): void {
    this.mountRequestData()
    if (this.updateForm.invalid) {
      // Marks all controls as touched
      Object.values(this.updateForm.controls).forEach((group: FormGroup) => {
        if (group instanceof FormGroup) {
          Object.values(group.controls).forEach((control: FormControl) => {
            control.markAsTouched();
          })
        }
      })
      this.notify.show('error', 'Existem campos inválidos. Por favor verifique os com borda em vermelho.');
      return;
    }
    this.loading = true;
    const requestData = this.mountRequestData();

    this.register.updateRegister(requestData).subscribe(
      (_) => {
        this.notify.show('success', 'Seus dados foram encaminhados para análise');
        this.loading = false;
      },
      ({ message }) => {
        this.notify.show('error', message ? message : defaultReqErrMessage);
        this.loading = false;
      }
    );
  }

  public getAddress() {
    const cepOnlyNumbers = this.f.zip_code.value.replace(/\D/g, '');
    if (cepOnlyNumbers.replace(/\D/g, '').length === 8) {
      this.loadingCepData = true;
      this.register.getAddressData(this.f.zip_code.value).subscribe(res => {
        this.f.address.setValue(res.street);
        this.f.neighborhood.setValue(res.district);
        this.f.city.setValue(res.city);
        this.f.state.setValue(res.uf);
        this.loadingCepData = false;
      }, ({ message }) => {
        this.loadingCepData = false;
      })
    }
  }

}
