import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../../services/quotation/quotation.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NotifyService } from '../../../services/notify/notify.service';

interface IPaymentMethods {
  id: number;
  title: string;
};

interface IPaymentInfo extends IPaymentMethods {
  [key: string]: {
    id: number;
    value: number;
    price: number;
    payment_form: 'Antecipado' | 'Postecipado';
  } | any
};

interface IStatus {
  [key: string]: boolean
}

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.css']
})
export class QuotationsComponent implements OnInit {

  private isSelling: boolean;
  public lockStatus: IStatus = {};
  public showForm: IStatus = {}
  public quot = [
    {
      "id": 138320,
      "status_orders": null,
      "created_at": "2019-10-23",
      "updated_at": {
        "date": "2019-10-23 14:44:00.000000",
        "timezone_type": 3,
        "timezone": "UTC"
      },
      "total": 3715.5,
      "programs": {
        "JJ": {
          "2": {
            "id": 170592,
            "value": 15,
            "price": 225,
            "payment_form": "Antecipado"
          },
          "3": {
            "id": 170593,
            "value": 15,
            "price": 247.5,
            "payment_form": "Postecipado"
          },
          "title": "TAM",
          "id": 1
        },
        "G3": {
          "2": {
            "id": 170595,
            "value": 31,
            "price": 558,
            "payment_form": "Antecipado"
          },
          "3": {
            "id": 170594,
            "value": 31,
            "price": 620,
            "payment_form": "Postecipado"
          },
          "title": "GOL",
          "id": 2
        },
        "AD": {
          "2": {
            "id": 170596,
            "value": 50,
            "price": 1375,
            "payment_form": "Antecipado"
          },
          "title": "AZUL",
          "id": 3
        },
        "TRB": {
          "2": {
            "id": 170597,
            "value": 23,
            "price": 690,
            "payment_form": "Antecipado"
          },
          "title": "TAM Red e Black",
          "id": 5
        }
      }
    }
  ]
//   [
//     {
//         "id": 138320,
//         "status_orders": null,
//         "created_at": "2019-10-23",
//         "updated_at": {
//             "date": "2019-10-23 14:44:00.000000",
//             "timezone_type": 3,
//             "timezone": "UTC"
//         },
//         "total": 3715.5,
//         "programs": [
//             {
//                 "id": 170592,
//                 "value": 15,
//                 "price": 225,
//                 "program_title": "TAM",
//                 "program_code": "JJ",
//                 "program_id": 1,
//                 "payment_form_id": 2
//             },
//             {
//                 "id": 170593,
//                 "value": 15,
//                 "price": 247.5,
//                 "program_title": "TAM",
//                 "program_code": "JJ",
//                 "program_id": 1,
//                 "payment_form_id": 3
//             },
//             {
//                 "id": 170594,
//                 "value": 31,
//                 "price": 620,
//                 "program_title": "GOL",
//                 "program_code": "G3",
//                 "program_id": 2,
//                 "payment_form_id": 2
//             },
//             {
//                 "id": 170595,
//                 "value": 31,
//                 "price": 558,
//                 "program_title": "GOL",
//                 "program_code": "G3",
//                 "program_id": 2,
//                 "payment_form_id": 3
//             },
//             {
//                 "id": 170596,
//                 "value": 50,
//                 "price": 1375,
//                 "program_title": "AZUL",
//                 "program_code": "AD",
//                 "program_id": 3,
//                 "payment_form_id": 2
//             },
//             {
//                 "id": 170597,
//                 "value": 23,
//                 "price": 690,
//                 "program_title": "TAM Red e Black",
//                 "program_code": "TRB",
//                 "program_id": 5,
//                 "payment_form_id": 2
//             }
//         ]
//     }
// ]

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
  visibleForms: Array<any> = [];
  fidelities: Array<any> = [];
  loading: any = true;
  paymentMethods: IPaymentMethods[];
  programs: Array<[string, IPaymentInfo]>;

  constructor(private quotationService: QuotationService, private authService: AuthService, private notify: NotifyService) { }

  ngOnInit() {
    this.paymentMethods = [
      {
        title: 'Indefinido',
        id: 1
      },
      {
        "title": "Antecipado",
        "id": 2
      },
      {
        "title": "Postecipado",
        "id": 3
      }
    ]
    this.getQuotations();
    // this.getPaymentsMethods();
  }

  private getPaymentsMethods() {
    this.quotationService.getPaymentMethods().subscribe(res => {
      this.paymentMethods = res;
    }, err => {
      console.log('err: ', err);
    })
  }

  public getQuotations() {
    this.loading = true;
    this.quotationService.getQuotations()
    .subscribe(res => {
      // this.quotations = res.data;
      this.quotations = this.quot;
      this.programs = Object.entries(this.quotations[0].programs);
      this.programs.forEach((_, i) => this.showForm[i] = false);
      // console.log('this.programs: ', this.programs);
      this.loading = false;
      for (const quotation of this.quotations) {
        this.fidelities[quotation.id] = [];
        this.getProviderFidelities() //gambi why return subscribe don't wait the function over
            .then(() => {
              this.programs.forEach(([key, value]) => {
                this.fidelities[quotation.id][value.id] = {
                  id: value.id,
                  number: ['JJ', 'TRB'].includes(key) ?
                      this.authService.getDataUser().cpf :
                      this.detailsFidelities[(value.id - 1)].card_number,
                  price: Object.values(value).find(obj => obj.price).price,
                  value: Object.values(value).find(obj => obj.value).value,
                  files: []
                };
              });
            });
      }
    }, err => {
      this.loading = false;
      this.quotations = this.quot;
    });
  }

  private getProviderFidelities(): Promise<any> {
    return this.quotationService.getProviderFidelities().toPromise().then(
      (fidelities) => {
        this.programs.forEach(([, value]) => {
          fidelities.forEach((fidelity) => {
              if (fidelity.program_id === value.id) {
                this.detailsFidelities[(value.id - 1)].card_number = fidelity.card_number;
              }
            });
        });
      }
    );
  }

  public sellQuotation(id): void {
    this.isSelling = true;
    Object.keys(this.showForm).forEach(key => this.showForm[key] = true);
    this.visibleForms.push(this.quotations.filter(quotation => quotation.id === id)[0]);
  }

  public unsellQuotation(id): void {
    this.isSelling = false;
    Object.keys(this.showForm).forEach(key => this.showForm[key] = false);
    this.visibleForms = this.visibleForms.filter(quotation => quotation.id !== id);
  }

  public isVisibleForm(id): boolean {
    return this.visibleForms.filter(quotation => quotation.id === id).length > 0;
  }

  public getMiles(program: IPaymentInfo): number {
    const paymentMethodInfo = Object.values(program).find((method) => method.value);
    if (typeof paymentMethodInfo == 'number')
      return 0;
    else
      return paymentMethodInfo.value;
  }

  public getValue(programInfo: IPaymentInfo, quotation): number | string {
    return this.fidelities[quotation.id][programInfo.id] ? this.fidelities[quotation.id][programInfo.id].payment_method : '';
    // return paymentObj ? paymentObj.price : '';
  }

  public saveFidelities(id) {
    this.loading = true;

    const data = {
      quotation_id: id,
      orders_programs: this.fidelities[id].filter(f => f)
    };

    this.quotationService.createOrder(data)
      .subscribe(res => {
        this.notify.show('success', 'Dados enviados com sucesso!');
        this.getQuotations();
        this.unsellQuotation(id);
        this.loading = false;
      }, err => {
        this.loading = false;
        this.notify.show('error', 'Ocorreu um erro ao tentar enviar seus dados!');
      });
  }

  public uploadFile(event, quotation_id, program_id) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.fidelities[quotation_id][program_id].files.push({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
  }

  public paymentMethodChange(event: any, index: number, quotationId: number, programId: number): void {
    const { target: { value } } = event;
    const programMethods = this.programs[index][1];
    const method = this.paymentMethods.find(met => met.id == value).title;
    const methodInfo = Object.values(programMethods).find(info => info && info.payment_form == method);
    if (methodInfo)
      this.fidelities[quotationId][programId].payment_method = methodInfo.price;
    else
      this.fidelities[quotationId][programId].payment_method = '';
  }

  /**
   * @description Locks/unlocks password visualization
   * @param index 
   * @param unlock 
   */
  public lockUnlock(index: number, unlock: boolean): void {
    const passwordInput = document.getElementById(`tam-senha-${index}`);
    this.lockStatus[index] = unlock;
    const inputType = passwordInput.getAttribute('type');
    if (inputType === 'text') {
      passwordInput.setAttribute('type', 'password');
    } else
      passwordInput.setAttribute('type', 'text');
  }

  public manageFormVisibility(index: number) {
    if (this.isSelling)
      this.showForm[index] = !this.showForm[index]
  }

}
