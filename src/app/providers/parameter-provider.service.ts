import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParameterProviderService {
  inUser:any = localStorage.getItem('usuario');

  endpoint = environment.urlSisgerh+'obtenerInformacion?inPersona='+btoa(this.inUser)
  parameters: string[]=[]
  constructor(private http: HttpClient) { 
    }
    searchParameters() {
      return this.http.get(this.endpoint).toPromise().then((response: any) => {
        this.parameters = response.parameters;
      });
  }
}
