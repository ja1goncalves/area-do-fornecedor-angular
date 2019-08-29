import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { RegisterService } from 'src/app/services/register/register.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AccessData, Address, Personal, RequestData, FidelitiesData, Bank } from 'src/app/models/register-data';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public RequestData: RequestData = {} as RequestData;

  // Form
  public accessDataForm: FormGroup;
  public confirmForm: FormGroup;
  public bankDataForm: FormGroup;
  public fidelitiesForm: FormGroup;
  public personalDataForm: FormGroup;

  ngOnInit() {
    this.accessDataForm = this._formBuilder.group({
      hiddenCtrl: ['', Validators.required]
    });

    this.confirmForm = this._formBuilder.group({
      confirmCtrl: ['', Validators.required]
    });
  }

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
    private login: AuthService,
    private notify: NotifyService,
    private router: Router,
    private _formBuilder: FormBuilder) {}

  public accessDataReceiver($event, stepper): void {
    this.accessData = $event.accessData;
    this.createRegister(stepper, $event.fromQuotation);
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
      if (this.fidelitiesData[`card_number_${program.code}`]) {
        fidelities.push(
          {
            program_id: program.id,
            card_number: this.fidelitiesData[`card_number_${program.code}`],
            access_password: this.fidelitiesData[`access_password_${program.code}`] ? this.fidelitiesData[`access_password_${program.code}`] : '',
            type: this.fidelitiesData[`type_${program.code}`] ? this.fidelitiesData[`type_${program.code}`] : ''
          }
        );
      }
    });

    this.RequestData.fidelities = fidelities;
    stepper.next();
  }

  public bankDataReceiver($event): void {
    this.bankData = $event;
    this.RequestData.bank = this.bankData;
    this.updateRegister();
  }

  public createRegister(stepper: any, fromQuotation: boolean): void {
    this.register.createRegister(this.accessData, fromQuotation).subscribe(
      (createdUser: any) => {
        this.notify.show('success', 'Por favor, verifique seu email');
        this.accessDataForm.controls['hiddenCtrl'].setValue('Check');
        stepper.next();
     },
     (err) => {
       this.notify.show('error', err.message);
     }
    );
  }

  public checkConfirm(stepper: any): void {
    this.login.loginUser(this.accessData.email, this.accessData.password).subscribe(
      (tokenData: any) => {
        this.getUserAuthenticated();
        this.confirmForm.controls['confirmCtrl'].setValue('Check');
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
      (updatedData: any) => {
        this.notify.show('success', 'Cadastro finalizado com sucesso');
        this.router.navigate(['/minhas-cotacoes']);
      },
      (err) => {
        this.notify.show('error', err.message);
      }
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

}
