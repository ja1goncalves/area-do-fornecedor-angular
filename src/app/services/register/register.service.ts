import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { NotifyService } from '../notify/notify.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient, private notify: NotifyService) {}


  /**
   * 
   * @param token 
   */
  public checkToken(token: string): Observable<any> {

    return new Observable((observer) => {
      this.http.post(`${environment.API_URL}/api/check-token`, {token})
      .subscribe((res) => {
        console.log('ct',res)
        observer.next(res);
      },
      (err) => {
        console.log('ct err', err)
        observer.error(err.error);
      });
    })

  }

  /**
   * 
   * @param code 
   * @param username 
   */
  public confirmRegister(code: string, username: string): Observable<any> {

    return new Observable((observer) => {
        this.http.post(`${environment.API_URL}/api/confirm-register`, {code, username})
        .subscribe((res) => {
          observer.next(res);
        },
        (err) => {
          observer.error(err.error);
        });
    });

  }
  
  public createRegister(requestData: any): Observable<any> {
    
    return new Observable((observer) => {
      this.http.post(`${environment.API_URL}/api/provider-register`, requestData)
       .subscribe((res) => {
         observer.next(res);
       }, (err) => {
         observer.error(err.error);
       })
    });

  }
  
  public getBanks(): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/banks`)
       .subscribe((res) => {
         observer.next(res);
       }, (err) => {
         observer.error(err.error);
       })
    });

  }

  public getSegments(bank_id: string): Observable<any> {

    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/segments/${bank_id}`)
       .subscribe((res) => {
         observer.next(res);
       }, (err) => {
         observer.error(err.error);
       })
    });

  }

  public updateRegister(requestData: any): Observable<any> {
    
    return new Observable((observer) => {
      this.http.put(`${environment.API_URL}/api/provider-update`, requestData)
       .subscribe((res) => {
         observer.next(res);
       }, (err) => {
         observer.error(err.error);
       })
    });

  } 
}
