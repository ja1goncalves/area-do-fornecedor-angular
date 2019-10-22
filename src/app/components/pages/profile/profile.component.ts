import { Component, OnInit, AfterViewInit, ViewChild, Optional } from '@angular/core';
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
import { IFidelity, IRequestData } from './interfaces';

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
      address: this.personalForm.get('residential_address').value,
      city: this.personalForm.get('residential_city').value,
      complement: this.personalForm.get('residential_complement').value,
      neighborhood: this.personalForm.get('residential_neighborhood').value,
      number: this.personalForm.get('residential_number').value,
      state: this.personalForm.get('residential_state').value,
      zip_code: this.personalForm.get('residential_zip_code').value
    };

    requestData.bank = {
      id: this.bankForm.get('id').value,
      account: this.bankForm.get('bank_account').value,
      account_digit: this.bankForm.get('bank_account_digit').value,
      agency: this.bankForm.get('bank_agency').value,
      agency_digit: this.bankForm.get('bank_agency_digit').value,
      bank_id: this.bankForm.get('bank_id').value,
      operation: this.bankForm.get('bank_operation').value,
      segment_id: this.bankForm.get('bank_segment_id').value,
      type: this.bankForm.get('bank_type').value
    };

    requestData.personal = {
      birthday: this.personalForm.get('personal_birthday').value,
      cellphone: this.personalForm.get('personal_cellphone').value,
      company: this.personalForm.get('personal_company').value,
      company_phone: this.personalForm.get('personal_company_phone').value,
      gender: this.personalForm.get('personal_gender').value,
      occupation: this.personalForm.get('personal_occupation').value,
      phone: this.personalForm.get('personal_phone').value,
      provider_occupation_id: this.personalForm.get('personal_occupation_id').value
    };

    if (typeof requestData.personal.birthday !== 'string')
      requestData.personal.birthday = moment(requestData.personal.birthday).format('YYYY-MM-DD');

    const { controls } = this.fidelityForm;
    const fidelities: IFidelity[] = [];

    this.programs.forEach(program => {
      const { code } = program;

      if (controls[`card_number_${code}`].value) {
        let fidelity: IFidelity = {
          id: null,
          program_id: program.id,
          card_number: controls[`card_number_${code}`].value,
          access_password: controls[`access_password_${code}`].value || null,
        };

        // Sets the fidelity ids based on the program id
        this.initialValues.fidelities.forEach((initial_fidelity) => {
          if (initial_fidelity.program_id === program.id) {
            fidelity.id = initial_fidelity.id;
          }
        });

        fidelities.push(fidelity);
      }
    });
    requestData.fidelities = fidelities;

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
