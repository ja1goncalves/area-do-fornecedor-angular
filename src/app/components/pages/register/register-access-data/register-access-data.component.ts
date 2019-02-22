import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PasswordValidation } from 'src/app/helpers/validators';
import { AccessData } from 'src/app/models/register-data';
import { RegisterService } from 'src/app/services/register/register.service';

@Component({
  selector: 'app-register-access-data',
  templateUrl: './register-access-data.component.html',
  styleUrls: ['./register-access-data.component.css']
})
export class RegisterAccessDataComponent implements OnInit {

  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() accessDataForm: FormGroup;

  public accessData: AccessData;
  public fromQuotation: boolean;
  public submitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private register: RegisterService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.data.subscribe(
      (data) => { this.fromQuotation = data.fromQuotation; },
      (error) => { }
    );

    this.accessDataForm = this.formBuilder.group({
      email: [{ value: '', disabled: this.fromQuotation }, [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.minLength(14)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: PasswordValidation.MatchPassword });

    if (this.fromQuotation) {
      this.activatedRoute.params.subscribe(
        (params) => { this.checkToken(params.token); },
        (error) => { }
      );
    }

  }

  get f(): any { return this.accessDataForm.controls; }

  private checkToken(token: string): void {
    this.register.checkToken(token).subscribe(
      (tokenInfo: any) => {
        this.accessDataForm.controls.email.setValue(tokenInfo.email);
      }, (error) => { }
    );
  }

  public accessDataSubmit(): void {

    this.submitted = true;

    if (this.accessDataForm.valid) {
      this.accessData = {
        email: this.accessDataForm.controls.email.value,
        name: this.accessDataForm.controls.name.value,
        cpf: this.accessDataForm.controls.cpf.value,
        password: this.accessDataForm.controls.password.value,
      };

      this.submitData.emit({ accessData: this.accessData, fromQuotation: this.fromQuotation });
    }

  }
}
