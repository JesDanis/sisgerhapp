import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SisgerhAdminService {
url: string='http://172.20.0.84:7001/WSSisgerhApp/rest/sisgerh/';
//url: string='http://localhost:7001/WSSisgerhApp/rest/sisgerh/';

  req:string='';  
  constructor(private httpClient: HttpClient) { }
  /**
   * 
   * @returns 
   */
   
  obtenerListado():Observable<String>{
    this.req = this.url + 'selectAllApp'
    return this.httpClient.get<String>(this.req)
  }
  obtenerDatos(codigo:any):Observable<String>{

    const headers = { 'content-type': 'application/json' };
    const headers2 = { 'content-type': 'text/json' };
    const res ={'responseType': 'text'}
    this.req = this.url + 'selectContenido?inDMAPP_CODIGO=' + codigo
    return this.httpClient.get(this.req, {responseType: 'text'})
  }
  obtenerEtnia(codigo:any):Observable<String>{
    this.req=this.url+'selectEtnia?codigo='+codigo;
    return this.httpClient.get<string>(this.req);
  }
  obtenerTipoS(codigo:any):Observable<String>{
    this.req=this.url+'selectTipoSang?codigo='+codigo;
    return this.httpClient.get<string>(this.req);
  }
  obtenerContacto(codigo:any):Observable<String>{
    this.req=this.url+'selectContacto?codigo='+codigo;
    return this.httpClient.get<string>(this.req);
  }
  obtenerDivision(codigo:any):Observable<String>{
    this.req=this.url+'selectDivision?codigo='+codigo;
    return this.httpClient.get<string>(this.req);
  }
  obtenerInstruccion(codNivel:any,codTit:any):Observable<String>{
    this.req=this.url+'selectInformacionInstruccion?codNivel='+codNivel+'&codTit='+codTit;
    return this.httpClient.get<string>(this.req);
  }
  obtenerActualizacion(codigo:any):Observable<String>{
    this.req=this.url+'selectActualizacion?codigo='+codigo;
    return this.httpClient.get<string>(this.req);
  }
  getIPAddress():Observable<String> 
  {  
    this.req="http://api.ipify.org/?format=json"
    return this.httpClient.get<String>(this.req)
  } 
  updateDatos(json:any):Observable<String>{
    const headers = { 'content-type': 'application/json' };
    const body = JSON.parse(json);
    this.req = this.url + 'updateEstado';
    return this.httpClient.post<String>(this.req, body, { 'headers': headers });
  }   
  obtenerEmail(codPer:any):Observable<String>{
    this.req=this.url+'selectEmail?inperson='+codPer;
    return this.httpClient.get<string>(this.req);
  }   
  obtenerDiscapacidad():Observable<String>{
    this.req = this.url+'obtenerDiscapacidad';
    return this.httpClient.get<String>(this.req)
  }
  send_mail(json:any):Observable<String>{
    const headers = { 'content-type': 'application/json' };
    const body = JSON.parse(json);
    this.req = this.url + 'sendEmail';
    return this.httpClient.post<String>(this.req, body, { 'headers': headers });
  }
}
