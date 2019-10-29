import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register/register.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { defaultReqErrMessage } from 'src/app/app.utils';
import { RegisterPersonalDataComponent } from 'src/app/components/pages/register/register-personal-data/register-personal-data.component';
import { RegisterFidelityProgramsComponent } from 'src/app/components/pages/register/register-fidelity-programs/register-fidelity-programs.component';
import { RegisterBankDataComponent } from 'src/app/components/pages/register/register-bank-data/register-bank-data.component';
import { IRequestData } from './interfaces';

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
  
  public updateForm: FormGroup;

  public userInfo: any = { name: '', cpf: '', cellphone: '' };
  public hasSteps: boolean = false;

  public banks: any = [];
  public segments: any = [];
  public programs: any = [];
  public loading: boolean;

  public initialValues: any = {};
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

  ngOnInit() {
    this._adapter.setLocale('pt');
    (async () => {
      await this.getUserData();
      await this.getPrograms();
      await this.getBanks();
    })()
    this.updateForm = this.formBuilder.group({});
  }

  ngAfterViewInit() {
    // Adds the formGroup from each component to the father component inside this profile.component.
    this.updateForm.addControl('personalForm', this.personalComponent.personalDataForm);
    this.updateForm.addControl('fidelityForm', this.programsComponent.fidelityDataForm);
    this.updateForm.addControl('bankForm', this.registerComponent.bankDataForm);

    // Sets the father formGroup in the components as the one inside this profile.component.
    this.personalComponent.personalDataForm.setParent(this.updateForm);
    this.programsComponent.fidelityDataForm.setParent(this.updateForm);
    this.registerComponent.bankDataForm.setParent(this.updateForm);
  }

  get personalForm(): FormGroup {
    return this.updateForm.get('personalForm') as FormGroup
  }
  get bankForm(): FormGroup {
    return this.updateForm.get('bankForm') as FormGroup
  }
  get fidelityForm(): FormGroup {
    return this.updateForm.get('fidelityForm') as FormGroup
  }

  public getBanks() {
    this.register.getBanks().subscribe(
      (banks) => {
        this.banks = banks;
      },
      (_) => { }
    );
  }

  public getSegments(): void {
    const bank_id = this.bankForm.get('bank_id').value;
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
      (_) => { }
    );
  }

  public getPrograms() {
    this.register.getPrograms().subscribe(
      (programs) => {
          this.programs = programs;
          this.getProviderData();
        },
      (_) => { }
    );
  }

  public getUserData(): void {
    this.auth.getUserAuthenticated().subscribe(
      ({ name, cpf, cellphone, phone }) => {
        this.personalForm.get('personal_name').setValue(name);
        this.personalForm.get('personal_cpf').setValue(cpf);
        this.personalForm.get('personal_cellphone').setValue(cellphone);
        this.personalForm.get('personal_phone').setValue(phone);
        this.userData['name'] = name;
        this.userData['cpf'] = cpf;
      },
      (_) => { }
    );
  }

  public getProviderData(): void {
    this.loading = true;
    this.register.getProviderData().subscribe(
      (providerData) => {
        const { address, bank, personal, fidelities } = providerData;

        if (bank) {
          this.bankForm.get('id').setValue(bank.id || null);
          this.bankForm.get('bank_id').setValue(bank.bank_id);
          this.bankForm.get('bank_account').setValue(bank.account);
          this.bankForm.get('bank_account_digit').setValue(bank.account_digit);
          this.bankForm.get('bank_agency').setValue(bank.agency);
          this.bankForm.get('bank_agency_digit').setValue(bank.agency_digit);
          this.bankForm.get('bank_segment_id').setValue(bank.segment_id);
          this.bankForm.get('bank_operation').setValue(bank.operation);
          this.bankForm.get('bank_type').setValue(bank.type);
        }
        if (address) {
          this.personalForm.get('residential_id').setValue(address.id || null);
          this.personalForm.get('residential_zip_code').setValue(address.zip_code);
          this.personalForm.get('residential_address').setValue(address.address);
          this.personalForm.get('residential_number').setValue(address.number);
          this.personalForm.get('residential_complement').setValue(address.complement);
          this.personalForm.get('residential_neighborhood').setValue(address.neighborhood);
          this.personalForm.get('residential_city').setValue(address.city);
          this.personalForm.get('residential_state').setValue(address.state);
        }
        if (personal) {
          this.personalForm.get('personal_birthday').setValue(personal.birthday);
          this.personalForm.get('personal_gender').setValue(personal.gender);
          this.personalForm.get('personal_occupation_id').setValue(personal.provider_occupation_id);
          this.personalForm.get('personal_occupation').setValue(personal.occupation);
          this.personalForm.get('personal_company').setValue(personal.company);
          this.personalForm.get('personal_company_phone').setValue(personal.company_phone);
        }
        if (fidelities) {
          fidelities.forEach((fidelity) => {
            const { code } = fidelity;
            this.fidelityForm.get(`access_password_${code}`).setValue(fidelity.access_password);
            this.fidelityForm.get(`card_number_${code}`).setValue(fidelity.card_number);
          })
        }

        this.initialValues = providerData;
        const bankSegmentId = this.bankForm.get('bank_segment_id').value;
        if (bankSegmentId) {
          this.getSegments();
        }
        this.loading = false;
      },
      (error) => { console.log(error); }
    );
  }

  public mountRequestData(): IRequestData {
    const requestData: IRequestData = {
      address: null,
      personal: null,
      fidelities: null,
      bank: null,
    };

    requestData.address = {
      id: this.personalForm.get('residential_id').value,
      zip_code: this.personalForm.get('residential_zip_code').value,
      address: this.personalForm.get('residential_address').value,
      number: this.personalForm.get('residential_number').value,
      complement: this.personalForm.get('residential_complement').value,
      neighborhood: this.personalForm.get('residential_neighborhood').value,
      city: this.personalForm.get('residential_city').value,
      state: this.personalForm.get('residential_state').value,
    };

    requestData.bank = {
      id: this.bankForm.get('id').value,
      bank_id: this.bankForm.get('bank_id').value,
      type: this.bankForm.get('bank_type').value,
      segment_id: this.bankForm.get('bank_segment_id').value,
      agency: this.bankForm.get('bank_agency').value,
      agency_digit: this.bankForm.get('bank_agency_digit').value,
      account: this.bankForm.get('bank_account').value,
      account_digit: this.bankForm.get('bank_account_digit').value,
      operation: this.bankForm.get('bank_operation').value,
    };

    requestData.personal = {
      birthday: this.personalForm.get('personal_birthday').value,
      gender: this.personalForm.get('personal_gender').value,
      phone: this.personalForm.get('personal_phone').value,
      cellphone: this.personalForm.get('personal_cellphone').value,
      occupation: this.personalForm.get('personal_occupation').value,
      provider_occupation_id: this.personalForm.get('personal_occupation_id').value,
      company: this.personalForm.get('personal_company').value,
      company_phone: this.personalForm.get('personal_company_phone').value,
    };

    if (typeof requestData.personal.birthday !== 'string')
      requestData.personal.birthday = moment(requestData.personal.birthday).format('YYYY-MM-DD');

    requestData.fidelities = {
      card_number_JJ: this.fidelityForm.get('card_number_JJ').value,
      access_password_JJ: this.fidelityForm.get('access_password_JJ').value,
      type_JJ: this.fidelityForm.get('type_JJ').value ? 'TRB' : '',
      card_number_G3: this.fidelityForm.get('card_number_G3').value,
      access_password_G3: this.fidelityForm.get('access_password_G3').value,
      type_G3: this.fidelityForm.get('type_G3').value ? 'G3D' : '',
      card_number_AD: this.fidelityForm.get('card_number_AD').value,
      access_password_AD: this.fidelityForm.get('access_password_AD').value,
      card_number_AV: this.fidelityForm.get('card_number_AV').value,
      access_password_AV: this.fidelityForm.get('access_password_AV').value,
    };

    return requestData;
  }

  public submitForm(): void {
    if (this.updateForm.invalid) {
      // Marks all controls as touched
      Object.values(this.updateForm.controls).forEach((group: FormGroup) => {
        Object.values(group.controls).forEach((control: FormControl) => {
          control.markAsTouched();
        })
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

}
