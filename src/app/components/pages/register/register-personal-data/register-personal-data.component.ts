import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GENDERS, UFS, OCCUPATIONS } from 'src/app/config/consts';
import { Address, Personal } from 'src/app/models/register-data';

@Component({
  selector: 'app-register-personal-data',
  templateUrl: './register-personal-data.component.html',
  styleUrls: ['./register-personal-data.component.css']
})
export class RegisterPersonalDataComponent implements OnInit {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() personalDataForm: FormGroup;

  
  public personalData: Personal;
  public addressData: Address;

  public genders: any = GENDERS;
  public ufs: any[] = UFS;
  public occupations: any = OCCUPATIONS;




  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.personalDataForm = this.fb.group({
      personal_name:            ['', [Validators.required]],
      personal_cpf:             ['', [Validators.required]],
      personal_birthday:        ['', [Validators.required]],
      personal_gender:          ['', [Validators.required]],
      personal_phone:           ['', [Validators.required]],
      personal_cellphone:       ['', [Validators.required]],
      residential_zip_code:     ['', [Validators.required]],
      residential_address:      ['', [Validators.required]],
      residential_number:       ['', [Validators.required]],
      residential_complement:   ['', [Validators.required]],
      residential_neighborhood: ['', [Validators.required]],
      residential_city:         ['', [Validators.required]],
      residential_state:        ['', [Validators.required]],
      personal_occupation_id:   ['', [Validators.required]],
      personal_occupation:      ['', [Validators.required]],
      personal_company:         ['', [Validators.required]],
      personal_company_phone:   ['', [Validators.required]]
    });
  }

  public personalDataSubmit() {
    if(this.personalDataForm.valid){

      let formControls = this.personalDataForm.controls;

      this.personalData = {
        birthday: formControls.personal_birthday.value,
        gender: formControls.personal_gender.value,
        phone: formControls.personal_phone.value,
        cellphone: formControls.personal_cellphone.value,
        occupation: formControls.personal_occupation_id.value,
        provider_ocuppation_id: formControls.personal_occupation.value,
        company: formControls.personal_company.value,
        company_phone: formControls.personal_company_phone.value
      };

      this.addressData = {
        zip_code: formControls.residential_zip_code.value,
        address: formControls.residential_address.value,
        number: formControls.residential_number.value,
        complement: formControls.residential_complement.value,
        neighborhood: formControls.residential_neighborhood.value,
        city: formControls.residential_city.value,
        state: formControls.residential_state.value
      }

      let completePersonalData = {
        personalData: this.personalData,
        addressData: this.addressData
      };


      this.submitData.emit(completePersonalData);

    }
  }



}
