import { Component, OnInit, HostListener, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../../../services/register/register.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { UFS, OCCUPATIONS, GENDERS } from '../../../../config/consts';
import { PasswordValidation } from 'src/app/helpers/validators';
import { Subject } from 'rxjs';
import { AccessData, Personal, RequestData } from 'src/app/models/register-data';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public requestData: any = {
    personal: {
      birthday: '',
      gender: '',
      phone: '',
      cellphone: '',
      occupation: '',
      provider_ocuppation_id: 1,
      company: '',
      company_phone: '' 
    },  
    address: {
      zip_code: '',
      address: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '' 
    },  
    fidelities: [],  
    bank: {
      bank_id: '',
      type: '',
      segment_id: '',
      agency: '',
      agency_digit: '',
      account: '',
      account_digit: '',
      operation: 123
    }
  }
  public RequestData: RequestData;


  //Form
  public accessDataForm: FormGroup;
  public bankForm: FormGroup;
  public fidelitiesForm: FormGroup;
  public personalDataForm: FormGroup;

  //Data
  public accessData: AccessData;

  public addressPersonalData;




  public isValidToken: boolean;
  public banks: any;
  public segments: any;
  public userName: string;
  public userCpf: string;
  public fidelities: any = [];
  public programs: any[] = [];


  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private register: RegisterService,
    private login: AuthService) {}


  public accessDataReceiver($event, stepper) {
    this.accessData = $event;
    this.createRegister(stepper);
  }

  public personalDataReceiver($event, stepper) {
    this.addressPersonalData = $event;

    this.requestData.personal = this.addressPersonalData.personal;
    this.requestData.address = this.addressPersonalData.address;
    

    stepper.next();
  }



  createRegister(stepper: any): void {
    this.register.createRegister(this.accessData).subscribe(
      (createdUser) => {
        stepper.next();
     }, (err) => {
     });
  };

  checkConfirm(stepper: any): void {

    this.login.loginUser(this.accessData.email, this.accessData.password).subscribe(
      (tokenData) => {
        this.getUserAuthenticated();  
        stepper.next();
      }, 
      (err) => { }
    )

  }

  getUserAuthenticated(): void {
    this.login.getUserAuthenticated().subscribe(
      (userAuthenticated) => {
        this.setUserData(userAuthenticated);
        this.getBanks();
        this.getPrograms();
      }, 
      (err) => { }
    )
  }

  setUserData(request: object): void {
    this.userName = request['name'];
    this.userCpf = request['cpf'];
  }

  nextStep(stepper: any): void {
    stepper.next();
  }
  
  concludeRegister(): void {
    this.requestData.fidelities = this.fidelities.filter(fidelity => fidelity.card_number.length);
    this.register.updateRegister(this.requestData).subscribe(
      (updatedData) => { },
      (err) => { }
    );
  }
  

  getBanks(): void {
    this.register.getBanks().subscribe(
      (banks) => {
        this.banks = banks;
      },
      (err) => { }
    )
  }

  getSegments(bank_id: number):void {
    this.register.getSegments(bank_id).subscribe(
      (segments) => {
        this.segments = segments;
      },
      (err) => { }
    )
  }

  getPrograms(): void {
    this.register.getPrograms().subscribe(
      (programs) => {
        this.programs = programs.filter(program => !['TRB', 'G3D'].includes(program.code));

      },
      (err) => { }
    )
  }

  

  ngOnInit() {

    

    this.bankForm = this._formBuilder.group({
      bank_bank_id: [''],
      bank_type: [''],
      bank_segment_id: [''],
      bank_agency: [''],
      bank_agency_digit: [''],
      bank_account: [''],
      bank_account_digit: ['']
    });

    this.personalDataForm = this._formBuilder.group({
      personal_name: [''],
      personal_cpf: [''],
      personal_birthday: [''],
      personal_gender: [''],
      personal_phone: [''],
      personal_cellphone: [''],
      personal_occupation: [''],
      personal_occupation_id: [''],
      personal_company: [''],
      personal_company_phone: [''],
      residential_zip_code: [''],
      residential_address: [''],
      residential_number: [''],
      residential_complement: [''],
      residential_neighborhood: [''],
      residential_city: [''],
      residential_state: [''],
    });

  }
  
}
