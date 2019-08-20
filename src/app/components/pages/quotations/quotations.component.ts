import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../../services/quotation/quotation.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NotifyService } from '../../../services/notify/notify.service';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.css']
})
export class QuotationsComponent implements OnInit {

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

  constructor(private quotationService: QuotationService, private authService: AuthService, private notify: NotifyService) { }

  ngOnInit() {
    this.getQuotations();
  }

  public getQuotations() {
    this.loading = true;
    this.quotationService.getQuotations()
    .subscribe(res => {
      this.quotations = res.data;
      this.loading = false;
      for (const quotation of this.quotations) {
        this.fidelities[quotation.id] = [];
        this.getProviderFidelities(quotation.programs) //gambi why return subscribe don't wait the function over
            .then(() => {
              for (const program of quotation.programs) {
                this.fidelities[quotation.id][program.program_id] = {
                  id: program.program_id,
                  number: ['JJ', 'TRB'].includes(program.program_code) ? this.authService.getDataUser().cpf : this.detailsFidelities[(program.program_id - 1)].card_number,
                  price: program.price,
                  value: program.value,
                  files: []
                };
              }
            });
      }
    }, err => {
      this.loading = false;
    });
  }

  public getProviderFidelities(programs): any {
    return this.quotationService.getProviderFidelities().toPromise().then(
      (fidelities) => {
        programs.forEach((program) => {
          fidelities.forEach((fidelity) => {
              if(fidelity.program_id === program.program_id) {
                this.detailsFidelities[(program.program_id - 1)].card_number = fidelity.card_number;
              } 
            });  
        });
      }
    );
  }

  public sellQuotation(id) {
    this.visibleForms.push(this.quotations.filter(quotation => quotation.id === id)[0]);
  }

  public unsellQuotation(id) {
    this.visibleForms = this.visibleForms.filter(quotation => quotation.id !== id);
  }

  public isVisibleForm(id) {
    return this.visibleForms.filter(quotation => quotation.id === id).length > 0;
  }

  public saveFidelities(id) {

    const data = {
      quotation_id: id,
      orders_programs: this.fidelities[id].filter(f => f)
    };
    console.log(data);
    this.quotationService.createOrder(data)
    .subscribe(res => {
      this.notify.show('success', 'Dados enviados com!');
      this.getQuotations();
    }, err => {
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

}
