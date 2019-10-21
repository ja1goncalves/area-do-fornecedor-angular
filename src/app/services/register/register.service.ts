import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

interface IAddressData {
  city: string;
  district: string;
  street: string;
  street_view: string;
  uf: string;
  zip_code: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient, private route: Router) { }

  /**
   * @param token
   * @returns {Observable<any>}
   */
  public checkToken(token: string): Observable<any> {

    return new Observable((observer) => {
      this.http.post(`${environment.API_URL}/api/provider/check-token`, { token }).subscribe(
        (response: any) => { observer.next(response.data); },
        async (error) => {
          this.route.navigate(['/login']).then(r => {});
        }
      );
    });

  }

  /**
   * @param requestData
   * @param fromQuotation
   * @returns {Observable<any>}
   */
  public createRegister(requestData: any, fromQuotation: boolean): Observable<any> {

    const route = fromQuotation ? 'provider-Quotation' : 'provider-noQuotation';

    return new Observable((observer) => {
      this.http.post(`${environment.API_URL}/api/provider/${route}`, requestData).subscribe(
        (response: any) => {  observer.next(response); },
        (error) => { observer.error(error.error); }
      );
    });

  }

  /**
   *
   * @returns {Observable<any>}
   * @param token
   */
  public confirmRegister(token: string): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/provider/activate/${token}`).subscribe(
        (response: any) => { observer.next(response); },
        (error) => { observer.error(error.error); }
      );
    });

  }

  /**
   * @returns {Observable<any>}
   */
  public getBanks(): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/provider/banks`).subscribe(
        (response: any) => {  observer.next(response.data); },
        (error) => { observer.error(error.error); }
      );
    });

  }

  /**
   * @param bankId
   * @returns {Observable<any>}
   */
  public getSegmentsByBank(bankId: number): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/provider/bank/segments/${bankId}`).subscribe(
        (reponse: any) => { observer.next(reponse); },
        (error) => { observer.error(error.error); }
      );
    });

  }

  /**
   * @param id
   * @returns {Observable<any>}
   */
  public getSegment(id: number): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/provider/segments/${id}`).subscribe(
          (reponse: any) => { observer.next(reponse); },
          (error) => { observer.error(error.error); }
      );
    });

  }

    /**
   * @returns {Observable<any>}
   */
  public getPrograms(): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/provider/programs`).subscribe(
        (response: any) => { observer.next(response.data); },
        (error) => { observer.error(error); }
      );
    });

  }

  /**
   * @param id
   * @returns {Observable<any>}
   */
  public getProgramInfo(id: number): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/provider/programs/${id}`).subscribe(
        (response: any) => { observer.next(response); },
        (error) => { observer.error(error); }
      );
    });

  }

  /**
   *
   * @param requestData
   * @returns {Observable<any>}
   */
  public updateRegister(requestData: any): Observable<any> {

    return new Observable((observer) => {
      this.http.put(`${environment.API_URL}/api/provider/update`, requestData).subscribe(
        (response) => { observer.next(response); },
        (error) => { observer.error(error.error); }
      );
    });

  }

  /**
   * @returns {Observable<any>}
   */
  public getProviderData(): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/provider/data`).subscribe(
        (response: any) => { observer.next(response.data); },
        (error) => { observer.error(error.error); }
      );
    });
  }

  public getAddressData(cep: string): Observable<IAddressData> {
    return new Observable((observer) => {
      this.http.get(`https://gateway.buscaaereo.com.br/vision/cep/${cep}`).subscribe(
          (response: IAddressData) => { observer.next(response); },
          (error) => { observer.error(error); }
      );
    });
  }

}
