import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  constructor(private http: HttpClient) { }

  public getQuotations(): Observable<any> {
    return this.http.get(`${environment.API_URL}/api/provider/quotations`);
  }

  public createOrder(data): Observable<any> {
    return this.http.post(`${environment.API_URL}/api/provider/orders`, data);
  }

  public getProviderFidelities(): Observable<any> {
    return this.http.get(`${environment.API_URL}/api/provider/fidelities`);
  }

  public getPaymentMethods(): Observable<any> {
    return this.http.get(`${environment.API_URL}/api/provider/payment-forms`);
  }

}
