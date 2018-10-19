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
   */
  public checkToken(token: string): Observable<any> {



    return new Observable((observer) => {




      this.http.post(`${environment.API_URL}/api/check-token`, { token }).subscribe(
        (tokenInfo: any) => {

          observer.next(tokenInfo.data);
        },
        (err) => {


          observer.error(err.error);
        }
      );
    });

  }

  /**
   * 
   * @param requestData
   */
  public createRegister(requestData: any): Observable<any> {

    return new Observable((observer) => {
      this.http.post(`${environment.API_URL}/api/provider-register`, requestData).subscribe(
        (createdUser: any) => {
          observer.next(createdUser);
        },
        (err) => {
          observer.error(err.error);
        }
      )
    });

  }

  /**
   * 
   * @param code 
   * @param username 
   */
  public confirmRegister(code: string, username: string): Observable<any> {

    return new Observable((observer) => {
      this.http.post(`${environment.API_URL}/api/confirm-register`, { code, username }).subscribe(
        (confirmation: any) => {
          observer.next(confirmation);
        },
        (err) => {
          observer.error(err.error);
        }
      );
    });

  }

  public getBanks(): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/banks`).subscribe(
        (banks: any) => {
          observer.next(banks.data);
        },
        (err) => {
          observer.error(err.error);
        }
      )
    });

  }

  public getSegments(bank_id: number): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/segments/${bank_id}`).subscribe(
        (segments: any) => {
          observer.next(segments);
        },
        (err) => {
          observer.error(err.error);
        }
      )
    });

  }

  public getPrograms(): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/programs`).subscribe(
        (programs: any) => {
          observer.next(programs.data);
        },
        (err) => {
          observer.error(err.error);
        }
      )
    });

  }

  public updateRegister(requestData: any): Observable<any> {

    return new Observable((observer) => {
      this.http.put(`${environment.API_URL}/api/provider-update`, requestData).subscribe(
        (upadtedData) => {
          observer.next(upadtedData);
        },
        (err) => {
          observer.error(err.error);
        }
      )
    });

  }

  public getProviderData(): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/provider`).subscribe(
        (providerData: any) => {
          observer.next(providerData.data);
        },
        (err) => {
          observer.error(err.error);
        }
      )
    });
    
  }

}