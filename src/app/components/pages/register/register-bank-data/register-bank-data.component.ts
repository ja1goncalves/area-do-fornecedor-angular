import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Bank } from 'src/app/models/register-data';

@Component({
  selector: 'app-register-bank-data',
  templateUrl: './register-bank-data.component.html',
  styleUrls: ['./register-bank-data.component.css']
})
export class RegisterBankDataComponent implements OnInit {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() bankDataForm: FormGroup;

  public bankData: Bank;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.bankDataForm = this.fb.group({
      bank_id: ['', [Validators.required]],
      bank_type: ['', [Validators.required]],
      bank_segment_id: ['', [Validators.required]],
      bank_agency: ['', [Validators.required]],
      bank_agency_digit: ['', [Validators.required]],
      bank_account: ['', [Validators.required]],
      bank_account_digit: ['', [Validators.required]]
    });
  }

  bankDataSubmit() {
    if (this.bankDataForm.valid) {

      let formControls = this.bankDataForm.controls;

      this.bankData = {
        bank_id: formControls.bank_id.value,
        type: formControls.bank_type.value,
        segment_id: formControls.bank_segment_id.value,
        agency: formControls.bank_agency.value,
        agency_digit: formControls.bank_agency_digit.value,
        account: formControls.bank_account.value,
        account_digit: formControls.bank_account_digit.value,
        operation: formControls.bank_bank_id.value //FALTANDO INFORMAÇÃO
      };

      this.submitData.emit(this.bankData);

    }

  }

}
