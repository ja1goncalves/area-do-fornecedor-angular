import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getObjectCookie, getCookie, eraseCookie} from '../../app.utils';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import {NotifyService} from '../notify/notify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private router: Router,
    private notify: NotifyService,
    private http: HttpClient,
    ) { }


  /**
   *
   * @param {string} user
   */
  private createUserData(user: string): void {

    eraseCookie('auth_user_data');
    document.cookie = `auth_user_data=${user};Max-Age=21600`;

  }


  /**
   *
   * @param {string} token
   */
  private createTokenData(token: string): void {

    eraseCookie('auth_token');

    const objToken: any = JSON.parse(token);
    // const expires: number = (_.isObject(objToken)) ? objToken.token.expiresIn : 21600;

    document.cookie = `auth_token=${token};Max-Age=${21600}`;

  }


  /**
   *
   * @returns {any}
   */
  public getToken(): any {

    const jsonData: any = getObjectCookie('auth_token');

    if (_.isEmpty(jsonData) && !_.isObject(jsonData)) {

      eraseCookie('auth_token');
      this.router.navigate(['']);

    } else {

      return jsonData.token.AccessToken;

    }

  }


  /**
   *
   * @returns {any}
   */
  public getDataUser(): any {

    const jsonData: any = getObjectCookie('auth_user_data');

    if (_.isEmpty(jsonData) && !_.isObject(jsonData)) {
      this.logout();
    }

    return jsonData;

  }


  /**
   *
   * @returns {boolean}
   */
  public isLoggedIn(): boolean {

    moment.locale('pt-br');

    const tokenString: string = getCookie('auth_token') || '{}';
    const userString: string = getCookie('auth_user_data') || '{}';

    const token: any = JSON.parse(tokenString);
    const user: any = JSON.parse(userString);

    let result: boolean;

    try {
      if ((token && token.token && token.token.AccessToken)
      //  && (user && user.id)
      ) {

        const timeExpire = moment(parseInt(token.timeLogin, 10)).add(parseInt(token.token.expiresIn, 10), 'seconds');
        const isTokenExpired = timeExpire.isBefore(moment());
        console.log('isNotNull',  !isTokenExpired);
        result = token.token.AccessToken != null && !isTokenExpired;
      }

    } catch (error) {
      result = false;
    }

    return result;

  }


  /**
   *
   */
  public logout(): void {

    eraseCookie('auth_token');
    eraseCookie('auth_user_data');
    // cleanCookie();
    // this.share.clearAll();
    this.router.navigate(['']);
    window.stop();
    // location.reload();

  }


  /**
   *
   * @returns {Observable<any>}
   */
  public getUserAuthenticated(username): Observable<any> {

    return this.http.post(`${environment.API_URL}/api/user-authenticated`, {username});

  }


  /**
   *
   * @param {string} username
   * @param {string} password
   * @returns {any}
   */
  public loginUser(username: string, password: string): any {

    return new Observable((observer) => {

      this.http.post(`${environment.API_URL}/api/authenticate`, {
        username, password
      }).subscribe(
        (res) => {
          const token: string = JSON.stringify({ token: res, timeLogin: new Date().getTime() });
          this.createTokenData(token);

          this.getUserAuthenticated(username).subscribe(
            (data) => {
              console.log('response', data);
              const user = JSON.stringify(data.data);
              this.createUserData(user);

              observer.next();

            },
            (error: any) => {
              this.logout();
              observer.error(error.error);

            });

        },
        (error) => {

          observer.error(error.error);

        });

   });

  }


}
