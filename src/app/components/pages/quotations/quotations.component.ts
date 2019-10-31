import { Component, OnInit } from '@angular/core';
import { QuotationService } from 'src/app/services/quotation/quotation.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { IPaymentInfo, IPaymentMethods, IStatus, IQuotation } from './interfaces';
import { validateCpf } from 'src/app/app.utils';

const validatePaymentMethod = /^[^1]/;

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.css']
})
export class QuotationsComponent implements OnInit {

  private isSelling: { [key:string]: boolean } = {};
  public showForm: { [key:string]: IStatus } = {};

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
  quotations: IQuotation[] = [];
  loading: any = true;
  paymentMethods: IPaymentMethods[];
  programs: { [key:string]: Array<[string, IPaymentInfo]> } = {};

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
    .subscribe(({ data }) => {
      this.quotations = data;
      for (const quotation of this.quotations) {
        this.isSelling[quotation.id] = false;
        this.showForm[quotation.id] = {};
        // Adds the quotation group
        this.programsForm.addControl(`quot-group-${quotation.id}`, this.fb.group({}));
        const { status_orders } = quotation;
        this.programs[quotation.id] = Object.entries(quotation.programs);
        this.programs[quotation.id].forEach(([key, program], i) => {
          let miles = Object.values(program).find(programInfo => programInfo.value);
          miles = miles ? miles.value : 0;
  
          let price: string | number = '';
          // Verifies if there's a status order to display on screen
          if (status_orders) {
            const orderPrice = status_orders.find(ord => ord.program.toLowerCase() === key.toLowerCase());
            price = orderPrice ? orderPrice.price : price;
          }

          const cpfPattern = ['JJ', 'TRB'].includes(key);

          // Adds the program group inside the quotation group
          const quotGroup = this.programsForm.get(`quot-group-${quotation.id}`) as FormGroup;
          quotGroup.addControl(`program-form-${program.id}`, this.fb.group({
            id: [program.id],
            sellThis: [true],
            value: [miles],
            number: ['', [Validators.required, Validators.pattern(cpfPattern ? validateCpf : /^\d{1,20}$/)]],
            files: [[]],
            access_password: [''],
            price: [price],
            paymentMethod: ['1', [Validators.required, Validators.pattern(validatePaymentMethod)]]
          }));
          // Add a valuechanges changing the validation of the fields
          this.getForm(program.id, quotation.id)
              .get('sellThis').valueChanges
              .subscribe(value => 
                this.updateValidation(value, program.id, quotation.id)
              );
          this.showForm[quotation.id][i] = false;
        });
        this.getProviderFidelities(quotation);
      }
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  /**
   * @description Activates the validation of the fields if the form will be sended
   * @param {boolean} activate
   * @param {number} programId
   * @param {number} quotId
   */
  private updateValidation(activate: boolean, programId: number, quotId: number): void {
    const group = this.getForm(programId, quotId);
    if (activate) {
      group.get('paymentMethod').setValidators([Validators.required, Validators.pattern(validatePaymentMethod)]);
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

  private getProviderFidelities(quotation: IQuotation): any {
    return this.quotationService.getProviderFidelities().toPromise().then(
      (fidelities) => {
        this.programs[quotation.id].forEach(([code, value]) => {
          fidelities.forEach((fidelity) => {
              if (fidelity.program_id === value.id) {
                if (['JJ', 'TRB'].includes(code)) {
                  this.getForm(value.id, quotation.id)
                      .get('number')
                      .setValue(this.authService.getDataUser().cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'));
                } else {
                  this.getForm(value.id, quotation.id).get('number').setValue(fidelity.card_number);
                  this.getForm(value.id, quotation.id).get('number').clearValidators();
                }
              }
            });
        });
      }
    );
  }

  /**
   * @description Shows all forms
   * @param {number} quotId
   */
  public sellQuotation(quotId: number): void {
    this.isSelling[quotId] = true;
    Object.keys(this.showForm[quotId]).forEach(key => this.showForm[quotId][key] = true);
  }

  /**
   * @description Hides all forms
   * @param {number} quotId
   */
  public unsellQuotation(quotId: number): void {
    this.isSelling[quotId] = false;
    Object.keys(this.showForm[quotId]).forEach(key => this.showForm[quotId][key] = false);
  }

  /**
   * @description Verify if the form will be selled or not
   * @param {number} programId
   */
  public deactivateForm(programId: number, quotId: number): boolean {
    return this.isSelling[quotId] && !this.getForm(programId, quotId).get('sellThis').value;
  }

  public getMiles(program: IPaymentInfo, quotation: IQuotation): number {
    const paymentMethodInfo = Object.values(program).find((method) => method.value);
    if (typeof paymentMethodInfo === 'number') {
      return 0;
    } else {
      return paymentMethodInfo.value;
    }
  }

  public saveFidelities(quotId: number): void {
    const quotGroup = this.programsForm.get(`quot-group-${quotId}`) as FormGroup;
    if (quotGroup.invalid) {
      this.notify.show('error', 'Alguns campos estão com erro, por favor os verifique.');
      Object.values(quotGroup.controls).forEach((group: FormGroup) => {
        Object.values(group.controls).forEach((control: FormControl) => {
          control.markAsTouched();
        });
      });
      return;
    }

    this.loading = true;

    const fidelities = {};

    Object.values(quotGroup.controls).forEach((group: FormGroup) => {
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

  // public uploadFile(event, program_id: number, quotId: number): void {
  //   const reader = new FileReader();
  //   if (event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     reader.readAsDataURL(file);

  //     const result = reader.result as string;

  //     reader.onload = () => {
  //       const filesControl = this.getForm(program_id, quotId).get('files');
  //       filesControl.setValue([...filesControl.value, {
  //         filename: file.name,
  //         filetype: file.type,
  //         value: result.split(',')[1]
  //       }]);
  //     };
  //   }
  // }

  public paymentMethodChange(event: any, index: number, programId: number, quotId: number): void {
    const { target: { value } } = event;
    const programMethods = this.programs[quotId][index][1];
    const method = this.paymentMethods.find(met => met.id == value).title;
    const methodInfo = Object.values(programMethods).find(info => info && info.payment_form == method);
    const group = this.getForm(programId, quotId);
    if (methodInfo) {
      group.get('price').setValue(methodInfo.price);
    } else {
      group.get('price').setValue('');
    }
  }

  public getTotalValue(quotation: IQuotation): number | string {
    let total = 0;
    const programGroup = this.programsForm.get(`quot-group-${quotation.id}`) as FormGroup;
    Object.values(programGroup.controls).forEach((group: FormGroup) => {
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

  public manageFormVisibility(index: number, quotId: number): void {
    if (this.isSelling[quotId]) {
      this.showForm[quotId][index] = !this.showForm[quotId][index];
    }
  }

  public havePaymentMethod(method: IPaymentMethods, program): boolean {
    return Object.keys(program).some(programId => Number(programId) === method.id) || method.id === 1;
  }

  public sellUnsellProgram(program, quotation): void {
    const sellThisControl = this.getForm(program.id, quotation.id).get('sellThis');
    sellThisControl.setValue(!sellThisControl.value);
  }

  public emptyPrice(quotation: IQuotation): string {
    if (quotation.status_orders)
      return 'Não vendido';
    else
      return 'A definir'
  }

  public getForm(programId: number, quotId: number): AbstractControl {
    return this.programsForm.get(`quot-group-${quotId}`).get(`program-form-${programId}`);
  }

  public getStatusOrders(quotation, programCode: string) {
    return quotation.status_orders.find(ord => ord.program == programCode);
  }

}
