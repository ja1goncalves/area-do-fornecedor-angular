import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotifyService } from 'src/app/services/notify/notify.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient, private notify: NotifyService) { }

  /**
   * 
   * @param email 
   * @returns {Observable<any>}
   */
  public resetPassword(email: string): Observable<any> {
    
    return new Observable((observer) => {
      this.http.post(`${environment.API_URL}/api/password/email`, {email}).subscribe(
        (response) => { observer.next(response); },
        (error) => { observer.next(error); }
      );
    });
    
  }

  /**
   *
   * @param requestData
   * @returns {Observable<any>}
   */
  public confirmPassword(requestData: any): Observable<any> {

    return new Observable((observer) => {
      this.http.post(`${environment.API_URL}/api/password/reset`, requestData).subscribe(
        (response) => { observer.next(response); }, 
        (error) => { observer.next(error); }
      );
    });

  }

  /**
   * 
   * @param token
   * @returns {Observable<any>} 
   */
  public checkResetToken(token: string): Observable<any> {
    
    return new Observable((observer) => {
      this.http.get(`${environment.API_URL}/api/password/find/${token}`).subscribe(
        (response) => { observer.next(response); },
        (error) => { observer.next(error); }
      );
    });

  }

}

