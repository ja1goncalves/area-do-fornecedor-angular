import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegisterService } from '../../../services/register/register.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public updateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private register: RegisterService) { }

  ngOnInit() {
    this.register.getProviderData().subscribe(
      (providerData) => {
        console.log(providerData);
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
