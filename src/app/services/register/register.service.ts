import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  /**
   * 
   * @param token
   * @returns {Observable<any>}
   */
  public checkToken(token: string): Observable<any> { 

    return new Observable((observer) => { 
      this.http.post(`${environment.API_URL}/api/check-token`, { token }).subscribe(
        (response: any) => { observer.next(response.data); },
        (error) => { observer.error(error.error); }
      );
    });

  }

  /**
   * 
   * @param requestData
   * @param fromQuotation
   * @returns {Observable<any>}
   */
  public createRegister(requestData: any, fromQuotation: boolean): Observable<any> {

    const route = fromQuotation ? 'provider-register' : 'providerRegister';

    return new Observable((observer) => {
      this.http.post(`${environment.API_URL}/api/${route}`, requestData).subscribe(
        (response: any) => {  observer.next(response); },
        (error) => { observer.error(error.error); }
      );
    });

  }

  /**
   * 
   * @param code 
   * @param username 
   * @returns {Observable<any>}
   */
  public confirmRegister(code: string, username: string): Observable<any> {

    return new Observable((observer) => {
      this.http.post(`${environment.API_URL}/api/confirm-register`, { code, username }).subscribe(
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
      this.http.get(`${environment.API_URL}/api/banks`).subscribe(
        (response: any) => {  observer.next(response.data); },
        (error) => { observer.error(error.error); }
      );
    });

  }

  /**
   * @param bankId
   * @returns {Observable<any>}
   */
  public getSegments(bankId: number): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/segments/${bankId}`).subscribe(
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
      this.http.get(`${environment.API_URL}/api/programs`).subscribe(
        (response: any) => { observer.next(response.data); },
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
      this.http.put(`${environment.API_URL}/api/provider-update`, requestData).subscribe(
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
      this.http.get(`${environment.API_URL}/api/provider`).subscribe(
        (response: any) => { observer.next(response.data); },
        (error) => { observer.error(error.error); }
      );
    });
    
  }

}