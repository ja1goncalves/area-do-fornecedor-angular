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
        for (const program of quotation.programs) {
          this.fidelities[quotation.id][program.program_id] = {
            id: program.program_id,
            number: ['JJ', 'TRB'].includes(program.program_code) ? this.authService.getDataUser().cpf : null,
            price: program.price,
            value: program.value,
            file: null
          };
        }
      }
    }, err => {
      console.log(err);
      this.loading = false;
    });
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
        this.fidelities[quotation_id][program_id].file = {
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        };
      };
    }
  }

}
