import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegisterService } from '../../../../services/register/register.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { AccessData, Address, Personal, RequestData, FidelitiesData, Bank } from 'src/app/models/register-data';
import * as _ from 'lodash';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // public requestData: any = {
  //   personal: {
  //     birthday: '',
  //     gender: '',
  //     phone: '',
  //     cellphone: '',
  //     occupation: '',
  //     provider_occupation_id: 1,
  //     company: '',
  //     company_phone: ''
  //   },
  //   address: {
  //     zip_code: '',
  //     address: '',
  //     number: '',
  //     complement: '',
  //     neighborhood: '',
  //     city: '',
  //     state: ''
  //   },
  //   fidelities: [],
  //   bank: {
  //     bank_id: '',
  //     type: '',
  //     segment_id: '',
  //     agency: '',
  //     agency_digit: '',
  //     account: '',
  //     account_digit: '',
  //     operation: 123
  //   }
  // }

  public RequestData: RequestData = {} as RequestData;

  // Form
  public accessDataForm: FormGroup;
  public bankDataForm: FormGroup;
  public fidelitiesForm: FormGroup;
  public personalDataForm: FormGroup;

  // Data
  public accessData: AccessData;
  public addressPersonalData: {personalData: Personal, addressData: Address};
  public fidelitiesData: FidelitiesData;
  public bankData: Bank;

  public isValidToken: boolean;
  public banks: any;
  public userInfo: any = { name: '', cpf: '' };
  public fidelities: any = [];
  public programs: any[] = [];

  constructor(
    private register: RegisterService,
    private login: AuthService) {}

  public accessDataReceiver($event, stepper): void {
    this.accessData = $event;
    this.createRegister(stepper);
  }

  public personalDataReceiver($event, stepper): void {
    this.addressPersonalData = $event;
    this.RequestData.personal = this.addressPersonalData.personalData;
    this.RequestData.address = this.addressPersonalData.addressData;
    stepper.next();
  }

  public fidelitiesDataReceiver($event, stepper): void {
    this.fidelitiesData = $event;
    const fidelities = [];

    this.programs.forEach((program, index) => {
      fidelities.push(
        {
          program_id: program.id,
          card_number: this.fidelitiesData[`card_number_${program.code}`],
          access_password: this.fidelitiesData[`access_password_${program.code}`] ? this.fidelitiesData[`access_password_${program.code}`] : ''
        }
      );
    });

    this.RequestData.fidelities = fidelities;
    stepper.next();
  }

  public bankDataReceiver($event): void {
    this.bankData = $event;
    this.RequestData.bank = this.bankData;
    this.updateRegister();
  }

  public createRegister(stepper: any): void {
    this.register.createRegister(this.accessData).subscribe(
      (createdUser: any) => {
        stepper.next();
     },
     (err) => { }
    );
  }

  public checkConfirm(stepper: any): void {
    this.login.loginUser(this.accessData.email, this.accessData.password).subscribe(
      (tokenData: any) => {
        this.getUserAuthenticated();
        stepper.next();
      },
      (err) => { }
    );
  }

  public getUserAuthenticated(): void {
    this.login.getUserAuthenticated().subscribe(
      (userAuthenticated: any) => {
        this.setUserInfo(userAuthenticated);
        this.getBanks();
        this.getPrograms();
      },
      (err) => { }
    );
  }

  public setUserInfo(request: object): void {
    this.userInfo.name = request['name'];
    this.userInfo.cpf = request['cpf'];
  }

  public nextStep(stepper: any): void {
    stepper.next();
  }

  public updateRegister(): void {
    this.register.updateRegister(this.RequestData).subscribe(
      (updatedData: any) => { },
      (err) => { }
    );
  }

  public getBanks(): void {
    this.register.getBanks().subscribe(
      (banks: any) => {
        this.banks = banks;
      },
      (err) => { }
    );
  }

  public getPrograms(): void {
    this.register.getPrograms().subscribe(
      (programs: any[]) => {
        this.programs = programs.filter(program => !['TRB', 'G3D'].includes(program.code));
      },
      (err) => { }
    );
  }

  ngOnInit() { }

}
