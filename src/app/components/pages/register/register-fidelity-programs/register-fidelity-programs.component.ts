import { Component, Output, Input, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FidelitiesNumbers } from 'src/app/models/register-data';

@Component({
  selector: 'app-register-fidelity-programs',
  templateUrl: './register-fidelity-programs.component.html',
  styleUrls: ['./register-fidelity-programs.component.css']
})
export class RegisterFidelityProgramsComponent implements OnChanges {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() fidelityDataForm: FormGroup;
  @Input() programs;

  public fidelitiesData: FidelitiesNumbers;

  constructor(private formBuilder: FormBuilder) { }

  ngOnChanges(change: SimpleChanges) {

    const allPrograms = change.programs.currentValue;
    const programFormGroup = [];

    if (allPrograms.length) {
      allPrograms.forEach((program, index) => {
        programFormGroup[`card_number_${program.code}`] = ['', []];
        if (program.code === 'JJ') {
          programFormGroup[`access_password_${program.code}`] = ['', []];
        }
      });

      this.fidelityDataForm = this.formBuilder.group(programFormGroup);

    }
  }

  public fidelityDataSubmit(): void {

    if (this.fidelityDataForm.valid) {

      const formControls = this.fidelityDataForm.controls;

      this.fidelitiesData = {
        card_number_JJ: formControls.card_number_JJ.value,
        access_password_JJ: formControls.access_password_JJ.value,
        card_number_G3: formControls.card_number_G3.value,
        card_number_AD: formControls.card_number_AD.value,
        card_number_AV: formControls.card_number_AV.value,
      };

      this.submitData.emit(this.fidelitiesData);

    }

  }

}
