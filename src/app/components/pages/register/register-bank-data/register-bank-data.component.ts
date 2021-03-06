import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Bank } from 'src/app/models/register-data';
import { RegisterService } from 'src/app/services/register/register.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { invalidFormMessage, hasRequiredField } from 'src/app/form.utils';

@Component({
  selector: 'app-register-bank-data',
  templateUrl: './register-bank-data.component.html',
  styleUrls: ['./register-bank-data.component.css']
})
export class RegisterBankDataComponent implements OnInit, OnChanges {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() bankDataForm: FormGroup;
  @Input() banks: any;
  @Input() hasSteps = true;
  @Input() segments: any;
  @Input() loading: boolean;

  public bankData: Bank;
  public submitted: boolean;

  hasRequiredField = hasRequiredField;

  constructor(
    private formBuilder: FormBuilder,
    private register: RegisterService,
    private notify: NotifyService,
  ) { }

  ngOnInit() {
    this.bankDataForm = this.formBuilder.group({
      id:                 [''],
      bank_id:            ['', [Validators.required]],
      bank_type:          ['', [Validators.required]],
      bank_segment_id:    [{ value: '', disabled: true }, []],
      bank_agency:        ['', [Validators.required, Validators.maxLength(15)]],
      bank_agency_digit:  ['', [Validators.maxLength(1)]],
      bank_account:       ['', [Validators.required, Validators.maxLength(15)]],
      bank_account_digit: ['', [Validators.maxLength(1)]],
      bank_operation:     ['', []]
    });

    this.f.bank_id.valueChanges.subscribe(_ => {
      if (this.isCaixaEconomica()) {
        // Torna Operação obrigatória
        this.f.bank_operation.setValidators([Validators.required]);
        this.f.bank_operation.updateValueAndValidity();
        this.updateOperationNumber();
      } else {
        // Torna Operação opcional
        this.f.bank_operation.clearValidators();
        this.f.bank_operation.updateValueAndValidity();
      }
    });

    this.f.bank_type.valueChanges.subscribe(_ => {
      if(this.isCaixaEconomica())
        this.updateOperationNumber();
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.segments)
      this.segments = changes.segments.currentValue
  }

  /**
   * @description Verifies if the bank is Caixa Economica or CEF
   */
  isCaixaEconomica(): boolean {
    return this.f.bank_id.value == 103 || this.f.bank_id.value == 87;
  }

  /**
   * @description Updates operation number based on bank type
   */
  updateOperationNumber() {
    if (this.f.bank_type.value === 'CC')
      this.f.bank_operation.setValue('001');
    else if (this.f.bank_type.value === 'PP')
      this.f.bank_operation.setValue('013');
  }

  get f() { return this.bankDataForm.controls; }

  bankDataSubmit(): void {

    this.submitted = true;
    Object.values(this.bankDataForm.controls).forEach((control: FormControl) => {
      control.markAsTouched();
    });

    if (this.bankDataForm.invalid)
      return this.notify.show('error', invalidFormMessage);

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
    this.register.getSegmentsByBank(bank_id).subscribe(
      (segments) => {
        if (segments.length !== 0) {
          this.bankDataForm.controls['bank_segment_id'].enable();
          this.segments = segments;
        } else {
          this.bankDataForm.controls['bank_segment_id'].disable();
          this.segments = [];
        }
      },
      (err) => { }
    );
  }

}
