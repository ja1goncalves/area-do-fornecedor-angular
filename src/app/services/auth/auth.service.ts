import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import {getObjectCookie, getCookie, eraseCookie} from '../../app.utils';
import { environment } from '../../../environments/environment';
import {NotifyService} from '../notify/notify.service';
import { ShareDataService } from '../share/share-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(
    private router: Router,
    private http: HttpClient,
    private share: ShareDataService ) { }

  /**
   *
   * @param {string} user
   */
  private createUserData(user: string): void {

    eraseCookie('user_data');
    document.cookie = `user_data=${user};Max-Age=21600`;

  }

  /**
   *
   * @param {string} token
   */
  private createTokenData(token: string): void {

    eraseCookie('token');
    const objToken: any = JSON.parse(token);
    const expires: number = (_.isObject(objToken)) ? objToken.token.ExpiresIn : 21600;

    document.cookie = `token=${token};Max-Age=${expires}`;
  }

  /**
   *
   * @returns {any}
   */
  public getToken(): any {

    const jsonData: any = getObjectCookie('token');

    if (_.isEmpty(jsonData) && !_.isObject(jsonData)) {
      eraseCookie('token');
      this.router.navigate(['']);
    } else {
      return jsonData.token.access_token;
    }

  }

  /**
   *
   * @returns {any}
   */
  public getDataUser(): any {

    const jsonData: any = getObjectCookie('user_data');

    if (_.isEmpty(jsonData) && !_.isObject(jsonData)) {
      this.logout();
    }

    return jsonData;

  }

  /**
   *
   * @returns {any}
   */
  public getUsername(): any {

    const jsonData: any = getObjectCookie('user_data');

    if (_.isEmpty(jsonData) && !_.isObject(jsonData)) {
      return '';
    }

    return jsonData.name;

  }

  /**
   *
   * @returns {boolean}
   */
  public isLoggedIn(): boolean {
    
    let result = false;

    try {
      moment.locale('pt-br');

      const tokenString: string = getCookie('token') || '{}';
      const userString: string = getCookie('user_data') || '{}';
      const token: any = JSON.parse(tokenString);
      const user: any = JSON.parse(userString);

      if ((token && token.token && token.token.access_token) && user) {

        const timeExpire = moment(parseInt(token.timeLogin, 10)).add(parseInt(token.token.expires_in, 10), 'seconds');
        const isTokenExpired = timeExpire.isBefore(moment());
        result = token.token.access_token != null && !isTokenExpired;
      }

    } catch (error) {
      result = false;
    }

    return result;

  }

  public logout(): void {

    this.share.sendLoginState(false);

    eraseCookie('token');
    eraseCookie('user_data');
    this.router.navigate(['login']);
    window.stop();

  }

  /**
   *
   * @returns {Observable<any>}
   */
  public getUserAuthenticated(): Observable<any> {

    return this.http.get(`${environment.API_URL}/api/provider/auth-authenticated`);

  }

  /**
   *
   * @param {string} username
   * @param {string} password
   * @returns {any}
   */
  public loginUser(username: string, password: string): any {

    const requestData = {
      "username": username,
      "password": password,
      "grant_type": environment.GRANT_TYPE,
      "client_secret": environment.CLIENT_SECRET,
      "client_id": environment.CLIENT_ID,
      "scope": environment.scope
    };

    return new Observable((observer) => {

      this.http.post(`${environment.API_URL}/api/provider/oauth/token`, requestData).subscribe(
        (tokenInfo) => {
          const token: string = JSON.stringify({ token: tokenInfo, timeLogin: new Date().getTime() });
          this.createTokenData(token);
          this.getUserAuthenticated().subscribe(
            (data) => {
              this.share.sendLoginState(true);
              const user = JSON.stringify(data);
              this.createUserData(user);
              observer.next();
            }, (error: any) => {
              this.logout();
              observer.error(error.error);
            }
          );

        }, (error: any) => observer.error(error.error)
      );

    });

  }


}
