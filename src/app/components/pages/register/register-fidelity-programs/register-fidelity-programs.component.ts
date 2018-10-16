import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-fidelity-programs',
  templateUrl: './register-fidelity-programs.component.html',
  styleUrls: ['./register-fidelity-programs.component.css']
})
export class RegisterFidelityProgramsComponent implements OnChanges {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() fidelityDataForm: FormGroup;
  @Input() programs;

  public formGroupArray: any[];

  

  constructor(private fb: FormBuilder) { }

  ngOnChanges(change: SimpleChanges) {
    let allPrograms = change.programs.currentValue;
    let programFormGroup = [];
    if(allPrograms.length){
      allPrograms.forEach((program) => {
        programFormGroup["card_number_" + program.code] = ['', [Validators.required]];
        if(program.code === "JJ"){
          programFormGroup["access_password_" + program.code] = ['', [Validators.required]];
        };
      });

      programFormGroup.forEach((program) => {
        this.formGroupArray.push({title: program.title});
      });
      
      console.log(this.formGroupArray);
      

      this.fidelityDataForm = this.fb.group(programFormGroup);

    
    }
    

  }

  public fidelityDataSubmit() {
    if (this.fidelityDataForm.valid){


    }

  }

}
