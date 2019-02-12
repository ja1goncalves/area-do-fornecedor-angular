import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GENDERS, UFS, OCCUPATIONS } from 'src/app/config/consts';
import { Address, Personal } from 'src/app/models/register-data';
import * as moment from 'moment';

@Component({
  selector: 'app-register-personal-data',
  templateUrl: './register-personal-data.component.html',
  styleUrls: ['./register-personal-data.component.css']
})
export class RegisterPersonalDataComponent implements OnInit {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() personalDataForm: FormGroup;
  @Input() userInfo: any;

  public personalData: Personal;
  public addressData: Address;

  public genders: any[] = GENDERS;
  public ufs: any[] = UFS;
  public occupations: any[] = OCCUPATIONS;
  public submitted: boolean;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.initFormControlls();

  }

  get f():any { return this.personalDataForm.controls; }
  
  private initFormControlls(): void {
    this.personalDataForm = this.formBuilder.group({
      personal_name:            [{value: '', disabled: true}, [Validators.required]],
      personal_cpf:             [{value: '', disabled: true}, [Validators.required]],
      personal_birthday:        ['', [Validators.required, Validators.minLength(8)]],
      personal_gender:          ['', [Validators.required]],
      personal_phone:           ['', []],
      personal_cellphone:       ['', [Validators.required, Validators.minLength(11)]],
      residential_zip_code:     ['', [Validators.required, Validators.minLength(8)]],
      residential_address:      ['', [Validators.required]],
      residential_number:       ['', [Validators.required]],
      residential_complement:   ['', []],
      residential_neighborhood: ['', [Validators.required]],
      residential_city:         ['', [Validators.required]],
      residential_state:        ['', [Validators.required]],
      personal_occupation_id:   ['', []],
      personal_occupation:      ['', []],
      personal_company:         ['', []],
      personal_company_phone:   ['', []]
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
  

}
