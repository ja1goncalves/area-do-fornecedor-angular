import { Component, OnInit } from '@angular/core';
import { QuotationService } from 'src/app/services/quotation/quotation.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { IPaymentInfo, IPaymentMethods, IStatus } from './interfaces';
import { validateCpf } from 'src/app/app.utils';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.css']
})
export class QuotationsComponent implements OnInit {

  private isSelling: boolean;
  public showForm: IStatus = {};

  public detailsFidelities = [
      {
        title: 'Latam',
        password_type: 'Multiplus',
        card_number: ''
      },
      {
        title: 'Gol',
        password_type: 'Smiles',
        card_number: ''
      },
      {
        title: 'Azul',
        password_type: 'Azul',
        card_number: ''
      },
      {
        title: 'Avianca',
        password_type: 'Avianca',
        card_number: ''
      },
      {
        title: 'LATAM Red e Black',
        password_type: 'LATAM Red e Black',
        card_number: ''
      },
      {
        title: 'Gol Diamante',
        password_type: 'Smiles Diamante',
        card_number: ''
      }
  ];
  quotations: Array<any> = [];
  loading: any = true;
  paymentMethods: IPaymentMethods[];
  programs: Array<[string, IPaymentInfo]> = [];

  programsForm: FormGroup;

  constructor(
    private quotationService: QuotationService,
    private authService: AuthService,
    private notify: NotifyService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.programsForm = this.fb.group({});
    this.getQuotations();
    this.getPaymentsMethods();
  }

  private getPaymentsMethods(): void {
    this.quotationService.getPaymentMethods().subscribe(res => {
      this.paymentMethods = res;
    }, err => {
      console.log('err: ', err);
    });
  }

  public getQuotations(): void {
    this.loading = true;
    this.quotationService.getQuotations()
    .subscribe(res => {
      this.quotations = res.data;
      if (this.quotations.length) {
        this.programs = Object.entries(this.quotations[0].programs);
        this.programs.forEach(([, program], i) => {
          let miles = Object.values(program).find(programInfo => programInfo.value);
          miles = miles ? miles.value : 0;
          this.programsForm.addControl(`program-form-${program.id}`, this.fb.group({
            id: [program.id],
            sellThis: [true],
            value: [miles],
            number: ['', [Validators.required, Validators.pattern(validateCpf)]],
            files: [[]],
            access_password: [''],
            price: [''],
            paymentMethod: [1, [Validators.required, Validators.pattern(/^[^1]/)]]
          }));
          // Add a valuechanges changing the validation of the fields
          this.programsForm.get(`program-form-${program.id}`)
              .get('sellThis').valueChanges
              .subscribe(value =>
                this.updateValidation(value, program.id)
              );
          this.showForm[i] = false;
        });
      }
      this.loading = false;


      for (const _ of this.quotations) {
        this.getProviderFidelities();
      }
    }, err => {
      this.loading = false;
    });
  }

  /**
   * @description Activates the validation of the fields if the form will be sended
   * @param {boolean} activate
   * @param programId
   */
  private updateValidation(activate: boolean, programId): void {
    const group = this.programsForm.get(`program-form-${programId}`);
    if (activate) {
      group.get('paymentMethod').setValidators([Validators.required, Validators.pattern(/^[^1]/)]);
      group.get('number').setValidators([Validators.required, Validators.pattern(validateCpf)]);
      group.get('paymentMethod').updateValueAndValidity();
      group.get('number').updateValueAndValidity();
    } else {
      group.get('paymentMethod').clearValidators();
      group.get('number').clearValidators();
      group.get('paymentMethod').updateValueAndValidity();
      group.get('number').updateValueAndValidity();
    }
  }

  private getProviderFidelities(): any {
    return this.quotationService.getProviderFidelities().toPromise().then(
      (fidelities) => {
        this.programs.forEach(([code, value]) => {
          console.log(code);
          fidelities.forEach((fidelity) => {
              if (fidelity.program_id === value.id) {
                if (['JJ', 'TRB'].includes(code)) {
                  this.programsForm.get(`program-form-${value.id}`)
                      .get('number')
                      .setValue(this.authService.getDataUser().cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'));
                } else {
                  this.programsForm.get(`program-form-${value.id}`).get('number').setValue(fidelity.card_number);
                  this.programsForm.get(`program-form-${value.id}`).get('number').clearValidators();
                }
              }
            });
        });
      }
    );
  }

  /**
   * @description Shows all forms
   * @param {number} id
   */
  public sellQuotation(id: number): void {
    this.isSelling = true;
    Object.keys(this.showForm).forEach(key => this.showForm[key] = true);
  }

  /**
   * @description Hides all forms
   * @param {number} id
   */
  public unsellQuotation(id: number): void {
    this.isSelling = false;
    Object.keys(this.showForm).forEach(key => this.showForm[key] = false);
  }

  /**
   * @description Verify if the form will be selled or not
   * @param {number} programId
   */
  public deactivateForm(programId: number): boolean {
    return this.isSelling && !this.programsForm.get(`program-form-${programId}`).get('sellThis').value;
  }

  public getMiles(program: IPaymentInfo): number {
    const paymentMethodInfo = Object.values(program).find((method) => method.value);
    if (typeof paymentMethodInfo === 'number') {
      return 0;
    } else {
      return paymentMethodInfo.value;
    }
  }

  public saveFidelities(quotId: number): void {
    if (this.programsForm.invalid) {
      this.notify.show('error', 'Alguns campos estão com erro, por favor os verifique.');
      Object.values(this.programsForm.controls).forEach((group: FormGroup) => {
        Object.values(group.controls).forEach((control: FormControl) => {
          control.markAsTouched();
        });
      });
      return;
    }

    this.loading = true;

    const fidelities = {};

    Object.values(this.programsForm.controls).forEach((group: FormGroup) => {
      if (group.get('sellThis').value) {
        const id = group.get('id').value;
        fidelities[id] = {
          id,
          number: group.get('number').value.replace(/\D/g),
          payment_form_id: group.get('paymentMethod').value,
          value: group.get('value').value,
          price: group.get('price').value,
          files: []
        };
        if (group.get('access_password').value) {
          fidelities[id].access_password = group.get('access_password').value;
        }
        if (group.get('files').value.length >= 1) {
          fidelities[id].files = group.get('files').value;
        }
      }
    });

    const data = {
      quotation_id: quotId,
      orders_programs: fidelities,
    };

    this.quotationService.createOrder(data)
      .subscribe(_ => {
        this.notify.show('success', 'Dados enviados com sucesso!');
        this.getQuotations();
        this.unsellQuotation(quotId);
        this.loading = false;
      }, ({ message }) => {
        this.loading = false;
        this.notify.show('error', message ? message : 'Ocorreu um erro ao tentar enviar seus dados!');
      });
  }

  public uploadFile(event, program_id) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);

      const result = reader.result as string;

      reader.onload = () => {
        const filesControl = this.programsForm.get(`program-form-${program_id}`).get('files');
        filesControl.setValue([...filesControl.value, {
          filename: file.name,
          filetype: file.type,
          value: result.split(',')[1]
        }]);
      };
    }
  }

  public paymentMethodChange(event: any, index: number, programId: number): void {
    const { target: { value } } = event;
    const programMethods = this.programs[index][1];
    const method = this.paymentMethods.find(met => met.id == value).title;
    const methodInfo = Object.values(programMethods).find(info => info && info.payment_form == method);
    const group = this.programsForm.get(`program-form-${programId}`);
    if (methodInfo) {
      group.get('price').setValue(methodInfo.price);
    } else {
      group.get('price').setValue('');
    }
  }

  public getTotalValue(): number | string {
    let total = 0;
    Object.values(this.programsForm.controls).forEach((group: FormGroup) => {
      if (group.get('sellThis').value) {
        const onlyNum = group.get('price').value ? Number(group.get('price').value) : 0;
        total += onlyNum;
      }
    });
    return total;
  }

  /**
   * @description Locks/unlocks password visualization
   * @param {number} index
   * @param {boolean} unlock
   */
  public lockUnlock(index: number, unlock: boolean): void {
    const passwordInput = document.getElementById(`tam-senha-${index}`);
    const inputType = passwordInput.getAttribute('type');
    if (inputType === 'text') {
      passwordInput.setAttribute('type', 'password');
    } else {
      passwordInput.setAttribute('type', 'text');
    }
  }

  public manageFormVisibility(index: number): void {
    if (this.isSelling) {
      this.showForm[index] = !this.showForm[index];
    }
  }

  public havePaymentMethod(method: IPaymentMethods, program): boolean {
    return Object.keys(program).some(programId => Number(programId) === method.id) || method.id === 1;
  }

  public sellUnsellProgram(program): void {
    const sellThisControl = this.getForm(program.id).get('sellThis');
    sellThisControl.setValue(!sellThisControl.value);
  }

  public emptyPrice(quotation): string {
    if (quotation.status_orders)
      return 'Não vendido';
    else
      return 'A definir'
  }

  public getForm(programId): AbstractControl {
    return this.programsForm.get(`program-form-${programId}`);
  }

}
