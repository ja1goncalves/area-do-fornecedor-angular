import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Bank } from 'src/app/models/register-data';
import { RegisterService } from 'src/app/services/register/register.service';

@Component({
  selector: 'app-register-bank-data',
  templateUrl: './register-bank-data.component.html',
  styleUrls: ['./register-bank-data.component.css']
})
export class RegisterBankDataComponent implements OnInit {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() bankDataForm: FormGroup;
  @Input() banks: any;

  public bankData: Bank;
  public segments: any;
  public submitted: boolean;

  constructor(private formBuilder: FormBuilder, private register: RegisterService) { }

  ngOnInit() {
    this.bankDataForm = this.formBuilder.group({
      bank_id:            ['', [Validators.required]],
      bank_type:          ['', [Validators.required]],
      bank_segment_id:    ['', []],
      bank_agency:        ['', [Validators.required, Validators.maxLength(15)]],
      bank_agency_digit:  ['', [Validators.required, Validators.maxLength(1)]],
      bank_account:       ['', [Validators.required, Validators.maxLength(15)]],
      bank_account_digit: ['', [Validators.required, Validators.maxLength(1)]],
      bank_operation:     ['', []]
    });
  }

  get f() { return this.bankDataForm.controls; }

  bankDataSubmit(): void {

    this.submitted = true;

    if (this.bankDataForm.valid) {

      const formControls = this.bankDataForm.controls;

      this.bankData = {
        bank_id: formControls.bank_id.value,
        type: formControls.bank_type.value,
        segment_id: formControls.bank_segment_id.value,
        agency: formControls.bank_agency.value,
        agency_digit: formControls.bank_agency_digit.value,
        account: formControls.bank_account.value,
        account_digit: formControls.bank_account_digit.value,
        operation: formControls.bank_operation.value
      };

      this.submitData.emit(this.bankData);

    }

  }

  getSegments(): void {

    const bank_id = this.bankDataForm.controls.bank_id.value;
    this.register.getSegments(bank_id).subscribe(
      (segments) => {
        this.segments = segments;
      },
      (err) => { }
    );
  }

}
