import { Component, Output, Input, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Fidelities } from 'src/app/models/register-data';

@Component({
  selector: 'app-register-fidelity-programs',
  templateUrl: './register-fidelity-programs.component.html',
  styleUrls: ['./register-fidelity-programs.component.css']
})
export class RegisterFidelityProgramsComponent implements OnChanges {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() fidelityDataForm: FormGroup;
  @Input() programs;

  public fidelitiesData: Fidelities;

  constructor(private fb: FormBuilder) { }

  ngOnChanges(change: SimpleChanges) {
    let allPrograms = change.programs.currentValue;
    let programFormGroup = [];

    if (allPrograms.length) {
      allPrograms.forEach((program, index) => {
        programFormGroup["card_number_" + program.code] = ['', [Validators.required]];
        if (program.code === "JJ") {
          programFormGroup["access_password_" + program.code] = ['', [Validators.required]];
        };
      });
      this.fidelityDataForm = this.fb.group(programFormGroup);
    }
  }

  public fidelityDataSubmit() {
    if (this.fidelityDataForm.valid) {

      let formControls = this.fidelityDataForm.controls;

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
