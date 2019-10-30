import {Component, Output, Input, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FidelitiesNumbers } from 'src/app/models/register-data';

@Component({
  selector: 'app-register-fidelity-programs',
  templateUrl: './register-fidelity-programs.component.html',
  styleUrls: ['./register-fidelity-programs.component.css']
})
export class RegisterFidelityProgramsComponent implements OnChanges, OnInit {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() fidelityDataForm: FormGroup;
  @Input() programs;
  @Input() hasSteps = true;

  public fidelitiesData: FidelitiesNumbers;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.fidelityDataForm = this.formBuilder.group({});
  }

  ngOnChanges(change: SimpleChanges) {
    const allPrograms = change.programs.currentValue;
    const hiddenFidelities = this.submitData ? ['AV'] : ['AV', 'TRB', 'G3D'];
    this.programs = this.programs.filter(({ code }) => !hiddenFidelities.includes(code));

    if (allPrograms.length) {
      allPrograms.forEach(program => {
        this.fidelityDataForm.addControl(`edit`, this.formBuilder.control(false, [Validators.maxLength(1)]));
        this.fidelityDataForm.addControl(`card_number_${program.code}`, this.formBuilder.control('', [Validators.maxLength(20)]));
        this.fidelityDataForm.addControl(`access_password_${program.code}`, this.formBuilder.control('', [Validators.maxLength(20)]));
        if (program.code === 'JJ' || program.code === 'G3') {
          this.fidelityDataForm.addControl(`type_${program.code}`, this.formBuilder.control('', [Validators.maxLength(20)]));
        }
      });
    }
  }

  public isEdit(): boolean {
    return !!this.fidelityDataForm.get('edit').value;
  }

  public fidelityDataSubmit(): void {

    if (this.fidelityDataForm.valid) {

      const formControls = this.fidelityDataForm.controls;

      this.fidelitiesData = {
        card_number_JJ: formControls.card_number_JJ.value,
        access_password_JJ: formControls.access_password_JJ.value,
        type_JJ: formControls.type_JJ.value ? 'TRB' : '',
        card_number_G3: formControls.card_number_G3.value,
        access_password_G3: formControls.access_password_G3.value,
        type_G3: formControls.type_G3.value ? 'G3D' : '',
        card_number_AD: formControls.card_number_AD.value,
        access_password_AD: formControls.access_password_AD.value,
        card_number_AV: formControls.card_number_AV.value,
        access_password_AV: formControls.access_password_AV.value,
      };

      this.submitData.emit(this.fidelitiesData);

    }

  }

}
