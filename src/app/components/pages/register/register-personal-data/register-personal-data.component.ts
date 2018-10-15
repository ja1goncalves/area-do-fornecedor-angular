import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-personal-data',
  templateUrl: './register-personal-data.component.html',
  styleUrls: ['./register-personal-data.component.css']
})
export class RegisterPersonalDataComponent implements OnInit {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() personalDataForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }



}
