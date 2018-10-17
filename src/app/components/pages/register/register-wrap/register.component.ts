import { Component, OnInit, HostListener, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../../../services/register/register.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { UFS, OCCUPATIONS, GENDERS } from '../../../../config/consts';
import { PasswordValidation } from 'src/app/helpers/validators';
import { Subject } from 'rxjs';
import { AccessData, Address, Personal, RequestData, Fidelities, Bank } from 'src/app/models/register-data';

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
  public RequestData: RequestData = {} as RequestData;


  //Form
  public accessDataForm: FormGroup;
  public bankDataForm: FormGroup;
  public fidelitiesForm: FormGroup;
  public personalDataForm: FormGroup;

  //Data
  public accessData: AccessData;
  public addressPersonalData: {personalData: Personal, addressData: Address};
  public fidelitiesData: Fidelities
  public bankData: Bank;




  public isValidToken: boolean;
  public banks: any;
  public userInfo: any = { name: '', cpf: '' };
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
    
    this.RequestData.personal = this.addressPersonalData.personalData;
    this.RequestData.address = this.addressPersonalData.addressData;
  
    stepper.next();
  }

  public fidelitiesDataReceiver($event, stepper) {
    this.fidelitiesData = $event;
    this.RequestData.fidelities = this.fidelitiesData;

    stepper.next();
  }

  public bankDataReceiver($event) {
    this.bankData = $event;
    this.RequestData.bank = this.bankData;
    
    this.updateRegister();
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
        this.setUserInfo(userAuthenticated);
        this.getBanks();
        this.getPrograms();
      }, 
      (err) => { }
    )
  }

  setUserInfo(request: object): void {
    this.userInfo.name = request['name'];
    this.userInfo.cpf = request['cpf'];
  }

  nextStep(stepper: any): void { 
    stepper.next();
  }
  
  updateRegister(): void {
    // this.RequestData.fidelities = this.fidelities.filter(fidelity => fidelity.card_number.length);
    this.register.updateRegister(this.RequestData).subscribe(
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


  getPrograms(): void {
    this.register.getPrograms().subscribe(
      (programs) => {
        this.programs = programs.filter(program => !['TRB', 'G3D'].includes(program.code));

      },
      (err) => { }
    )
  }

  

  ngOnInit() {
    console.log(this.RequestData);
    

   

  }
  
}
