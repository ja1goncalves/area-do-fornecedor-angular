import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmissionService {

  constructor(private http: HttpClient) { }

  public getEmissions(cpf:number): Observable<any> {
    return this.http.get(`${environment.API_URL}/api/provider/emissions?cpf=${cpf}&limit=100&page=1`);
  }
}
