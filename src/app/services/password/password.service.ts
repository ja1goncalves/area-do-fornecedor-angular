import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { NotifyService } from '../notify/notify.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient, private notify: NotifyService) {}


  /**
   *
   * @param requestData
   * @returns {Observable<any>}
   */
  public reset(username: string): any {
    
    const resetRequestData = {
      email: username
    };

    return this.http.post(`${environment.API_URL}/api/password/email`, {username})
      .subscribe((res) => {
        const message: string = 'O link para redefinir a senha foi enviado para o seu e-mail.';
        this.notify.show('success', message);
      },
      (err) => {
        const message: string = 'Algo deu errado. Tente novamente.';
        this.notify.show('warning', message);
      });
  }

  /**
   *
   * @param requestData
   * @returns {Observable<any>}
   */
  public confirm(requestData: any): any {
    
      // const resetRequestData = {
      //   password: requestData.password,
      //   password_confirmation: requestData.password_confirmation,
      //   token: requestData.token
      // };

    return new Observable((observer) => {
      this.http.post(`${environment.API_URL}/api/password/reset`, requestData)
        .subscribe((res) => {
          const message: string = 'A senha foi alterada com sucesso.';
          this.notify.show('success', message);
        },
        (err) => {
          console.log(err);
          const message: string = 'A sessão expirou. Tente novamente.';
          this.notify.show('warning', message);
        });
    }) 
  }

}
