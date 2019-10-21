import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GENDERS, UFS, OCCUPATIONS } from 'src/app/config/consts';
import { Address, Personal } from 'src/app/models/register-data';
import * as moment from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { RegisterService } from 'src/app/services/register/register.service';

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
  selector: 'app-register-personal-data',
  templateUrl: './register-personal-data.component.html',
  styleUrls: ['./register-personal-data.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ],
})
export class RegisterPersonalDataComponent implements OnInit, OnChanges {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() personalDataForm: FormGroup;
  @Input() userInfo: any;

  public personalData: Personal;
  public addressData: Address;

  public genders: any[] = GENDERS;
  public ufs: any[] = UFS;
  public occupations: any[] = OCCUPATIONS;
  public submitted: boolean;
  public startDate = new Date(1990, 0, 1);
  public maxDate = new Date();
  public minDate = new Date(this.maxDate.getFullYear() - 150, this.maxDate.getMonth());
  public loadingCepData: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    private registerService: RegisterService,
  ) { }

  ngOnInit() {
    this.initFormControls();
    this.initControlsValueChanges();
    this._adapter.setLocale('pt');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.userInfo.currentValue.cellphone) {
      this.f.personal_cellphone.setValue(changes.userInfo.currentValue.cellphone);
    }
    if (changes.userInfo.currentValue.phone) {
      this.f.personal_phone.setValue(changes.userInfo.currentValue.phone);
    }
  }

  get f(): any { return this.personalDataForm.controls; }

  private initFormControls(): void {
    this.personalDataForm = this.formBuilder.group({
      personal_name:            [{value: '', disabled: true}, [Validators.required]],
      personal_cpf:             [{value: '', disabled: true}, [Validators.required, Validators.minLength(11)]],
      personal_birthday:        ['', [Validators.required, Validators.minLength(8)]],
      personal_gender:          ['', [Validators.required]],
      personal_phone:           ['', [Validators.minLength(8)]],
      personal_cellphone:       ['', [Validators.required]],
      residential_zip_code:     ['', [Validators.required]],
      residential_address:      ['', [Validators.required, Validators.maxLength(60)]],
      residential_number:       ['', [Validators.required, Validators.maxLength(9)]],
      residential_complement:   ['', [Validators.maxLength(50)]],
      residential_neighborhood: ['', [Validators.required, Validators.maxLength(50)]],
      residential_city:         ['', [Validators.required, Validators.maxLength(30)]],
      residential_state:        ['', [Validators.required]],
      personal_occupation_id:   [''],
      personal_occupation:      ['', [Validators.maxLength(30)]],
      personal_company:         ['', [Validators.maxLength(30)]],
      personal_company_phone:   ['', [Validators.maxLength(30)]]
    });
  }

  private initControlsValueChanges(): void {
    this.f.personal_occupation_id.valueChanges.subscribe(value => {
      if (value !== 4 && value !== 6 && value !== 7) {
        this.f.personal_occupation.setValidators([Validators.required, Validators.maxLength(30)]);
        this.f.personal_occupation.updateValueAndValidity();
      } else {
        this.f.personal_occupation.setValidators([Validators.maxLength(30)]);
        this.f.personal_occupation.updateValueAndValidity();
      }
    });
  }

  private getPersonalData(): any {
    const formControls = this.personalDataForm.controls;
    const birthday = moment(this.personalDataForm.controls.personal_birthday.value, 'DD/MM/YYYY').format('YYYY-MM-DD');

    return {
      birthday: birthday,
      gender: formControls.personal_gender.value,
      phone: formControls.personal_phone.value,
      cellphone: formControls.personal_cellphone.value,
      occupation: formControls.personal_occupation.value,
      provider_occupation_id: formControls.personal_occupation_id.value,
      company: formControls.personal_company.value,
      company_phone: formControls.personal_company_phone.value
    };

  }

  private getAddressData(): any {
    const formControls = this.personalDataForm.controls;

    return {
      zip_code: formControls.residential_zip_code.value,
      address: formControls.residential_address.value,
      number: formControls.residential_number.value,
      complement: formControls.residential_complement.value,
      neighborhood: formControls.residential_neighborhood.value,
      city: formControls.residential_city.value,
      state: formControls.residential_state.value
    };

  }

  public personalDataSubmit(): void {
    this.submitted = true;

    if (this.personalDataForm.valid) {

      const completePersonalData = {
        personalData: this.getPersonalData(),
        addressData: this.getAddressData()
      };

      this.submitData.emit(completePersonalData);

    }
  }

  public getAddress() {
    const cepOnlyNumbers = this.f.residential_zip_code.value.replace(/\D/g, '');
    if (cepOnlyNumbers.replace(/\D/g, '').length === 8) {
      this.loadingCepData = true;
      this.registerService.getAddressData(this.f.residential_zip_code.value).subscribe(res => {
        this.f.residential_address.setValue(res.street);
        this.f.residential_neighborhood.setValue(res.district);
        this.f.residential_city.setValue(res.city);
        this.f.residential_state.setValue(res.uf);
        this.loadingCepData = false;
      }, ({ message }) => {
        this.loadingCepData = false;
      });
    }
  }

}
