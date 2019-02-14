import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

    public loginState = new Subject<any>();

    constructor(private http: HttpClient) { }

    public sendLoginState(state: boolean) {
        this.loginState.next(state);
    }
  


}
