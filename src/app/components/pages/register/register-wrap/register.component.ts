import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { RegisterService } from 'src/app/services/register/register.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AccessData, Address, Personal, RequestData, FidelitiesData, Bank } from 'src/app/models/register-data';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material';
import { defaultReqErrMessage } from 'src/app/app.utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  RequestData: RequestData = {
    personal: null,
    address: null,
    fidelities: null,
    bank: null,
  } as RequestData;
  showFidelityCheckbox = true;

  // Form
  accessDataForm: FormGroup;
  confirmForm: FormGroup;
  bankDataForm: FormGroup;
  fidelitiesForm: FormGroup;
  personalDataForm: FormGroup;
  loading: boolean;

  ngOnInit() {

    this.accessDataForm = this._formBuilder.group({
      hiddenCtrl: ['', Validators.required]
    });

    this.confirmForm = this._formBuilder.group({
      confirmCtrl: ['', Validators.required]
    });

  }

  // Data
  accessData: AccessData;
  addressPersonalData: {personalData: Personal, addressData: Address};
  fidelitiesData: FidelitiesData;
  bankData: Bank;

  isValidToken: boolean;
  banks: any;
  userInfo: any = { name: '', cpf: '', cellphone: '' };
  fidelities: any = [];
  programs: any[] = [];

  constructor(
    private register: RegisterService,
    private login: AuthService,
    private notify: NotifyService,
    private router: Router,
    private _formBuilder: FormBuilder) {}

  accessDataReceiver($event, stepper: MatStepper): void {

    this.accessData = $event.accessData;
    this.createRegister(stepper, $event.fromQuotation);

  }

  async personalDataReceiver($event, stepper: MatStepper): Promise<void> {

    this.addressPersonalData = $event;
    this.RequestData.personal = this.addressPersonalData.personalData;
    this.RequestData.address = this.addressPersonalData.addressData;
    await this.updateRegister(2);
    stepper.next();
    document.getElementById('scroll-to-stepper').scrollIntoView();

  }

  async fidelitiesDataReceiver($event, stepper: MatStepper): Promise<void> {

    this.fidelitiesData = $event;
    const fidelities = [];

    this.programs.forEach((program) => {
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
    await this.updateRegister(3);
    stepper.next();
    document.getElementById('scroll-to-stepper').scrollIntoView();

  }

  bankDataReceiver($event): void {

    this.bankData = $event;
    this.RequestData.bank = this.bankData;
    this.updateRegister(4)
      .then(() => {
        localStorage.removeItem('fromMock');
        this.notify.show('success', 'Cadastro finalizado com sucesso');
        this.router.navigate(['/minhas-cotacoes']);
      });
  }

  private createRegister(stepper: MatStepper, fromQuotation: boolean): void {

    this.loading = true;
    this.register.createRegister(this.accessData, fromQuotation).subscribe(
      (_) => {
        // this.notify.show('success', 'Por favor, verifique seu email');
        this.accessDataForm.controls['hiddenCtrl'].setValue('Check');
        return this.checkConfirm(stepper);
        // stepper.next();
     },
     ({ data, message }) => {
       let feedbackMessage = message;
       if (!message) {
        feedbackMessage = data.includes('email') ? 'e-mail já cadastrado' : '';
       }
       this.notify.show('error', feedbackMessage ? feedbackMessage : defaultReqErrMessage);
       this.loading = false;
     }
    );

  }

  checkConfirm(stepper: MatStepper): void {
    this.login.loginUser(this.accessData.email, this.accessData.password).subscribe(
      (_) => {

        this.getUserAuthenticated();
        this.confirmForm.controls['confirmCtrl'].setValue('Check');
        this.loading = false;
        localStorage.setItem('fromMock', 'true');
        stepper.next();
        document.getElementById('scroll-to-stepper').scrollIntoView();

      },
      ({ message }) => {
        this.notify.show('error', message ? message : defaultReqErrMessage);
        this.loading = false;
       }
    );
  }

  getUserAuthenticated(): void {
    this.login.getUserAuthenticated().subscribe(
      (userAuthenticated: any) => {
        this.setUserInfo(userAuthenticated);
        this.getBanks();
        this.getPrograms();
      },
      (err) => { }
    );
  }

  setUserInfo(request: object): void {
    this.userInfo = {};
    this.userInfo.name = request['name'];
    this.userInfo.cpf = request['cpf'].replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    this.userInfo.cellphone = request['cellphone'].replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    this.userInfo.phone = request['phone'].replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  nextStep(stepper: MatStepper): void {
    stepper.next();
  }

  private async updateRegister(step = 2): Promise<any> {

    const handleStep = {
      2: () => ({
        personal: this.RequestData.personal,
        address: this.RequestData.address,
        fidelities: [],
        bank: null,
      }),
      3: () => ({
        personal: this.RequestData.personal,
        address: [],
        fidelities: this.RequestData.fidelities,
        bank: null,
      }),
      4: () => ({
        personal: this.RequestData.personal,
        address: [],
        fidelities: [],
        bank: this.RequestData.bank,
      }),
    }

    const body = handleStep[step]();

    this.loading = true;
    return new Promise((resolve, reject) => {
      this.register.updateRegister(body).subscribe(
        () => {
          this.loading = false;
          resolve();
        },
        (error) => {
          this.notify.show('error', error.message ? error.message : defaultReqErrMessage);
          this.loading = false;
          reject(error);
        }
      );
    })

  }

  getBanks(): void {
    this.register.getBanks().subscribe(
      (banks: any) => {
        this.banks = banks;
      },
      (err) => { }
    );
  }

  getPrograms(): void {
    this.register.getPrograms().subscribe(
      (programs: any[]) => {
        this.programs = programs.filter(program => !['TRB', 'G3D'].includes(program.code));
      },
      (err) => { }
    );
  }

}
