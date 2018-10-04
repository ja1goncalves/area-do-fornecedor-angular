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
  public checkToken(token: string): any {

    return this.http.post(`${environment.API_URL}/api/check-token`, {token})
      .subscribe((res) => {
        const message: string = 'token validado com sucesso';
        this.notify.show('success', message);
      },
      (err) => {
        const message: string = 'token inválido';
        this.notify.show('warning', message);
      });
  }

  /**
   * 
   * @param code 
   * @param username 
   */
  public confirmRegister(code: string, username: string): any {

    return new Observable((observer) => {

        this.http.post(`${environment.API_URL}/api/confirm-register`, {code, username})
        .subscribe((res) => {
            const message: string = 'cadastro confirmado com sucesso';
            this.notify.show('success', message);
            observer.next();
        },
        (err) => {
            const message: string = 'verifique os dados e tente novamente!';
            this.notify.show('warning', message);
            observer.error(err.error);
        });

    });
  }
  

}
