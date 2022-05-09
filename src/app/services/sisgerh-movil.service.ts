import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import {InformacionInt} from '../models/empleado/informacion-int';
import {InstruccionInt} from '../models/empleado/instruccion-int';
import {ExperienciaInt} from '../models/empleado/experiencia-int';
import {FormacionInt} from '../models/empleado/formacion-int';
import {ConsolidadoInt} from '../models/asistencia/consolidado-int';
import {PermisosInt} from '../models/asistencia/permisos-int'
import {AdicionalInt} from '../models/asistencia/adicional-int';
import {NocturnaInt} from '../models/asistencia/nocturna-int';
import {ExtraordinariaInt} from '../models/asistencia/extraordinaria-int';
import {SolicitudesInt} from '../models/vacaciones/solicitudes-int';
import {NominaInt} from '../models/rolPagos/nomina-int'
import {IngresosInt} from '../models/rolPagos/ingresos-int'
import { DineroInt } from '../models/vacaciones/dinero-int';
import { TiempoInt } from '../models/vacaciones/tiempo-int';
import {InformacionAntInt} from '../models/anticipo/informacion-ant-int'
import {DetalleInt} from '../models/anticipo/detalle-int'
import { Adjunto } from '../models/adjunto';
@Injectable({
  providedIn: 'root'
})
export class SisgerhMovilService {
//url: string='http://172.20.0.84:7001/WSSisgerhApp/rest/sisgerh/';
url: string='http://localhost:7001/WSSisgerhApp/rest/sisgerh/';
req:string='';  
constructor(private httpClient: HttpClient) { }
/**
 * 
 * @param inUser 
 * @returns 
 */
  obtenerSesion(inUser:string){
    this.req=this.url+'obtenerSesion?inCuenta='+inUser;
    return this.httpClient.get(this.req);
  }
  /**
   * 
   * @param inUsuario 
   * @returns 
   */
  obtenerPerfil(inUsuario:string){
    this.req=this.url+'obtenerRol?inUsuario='+inUsuario;
    return this.httpClient.get(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @returns 
   */
  obternerInformacionPer(inPersona:string):Observable<InformacionInt[]>{
    this.req=this.url+'obtenerInformacion?inPersona='+inPersona;
    return this.httpClient.get<InformacionInt[]>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @returns 
   */
  obternerInstruccion(inPersona:string):Observable<InstruccionInt>{
    this.req=this.url+'obtenerInstruccion?inPersona='+inPersona;
    return this.httpClient.get<InstruccionInt>(this.req);
  }
  /**
   * 
   * @param inCodigo 
   * @returns 
   */
  informacionInstruccion(inCodigo:string):Observable<InstruccionInt>{
    this.req=this.url+'informacionInstruccion?inCodigo='+inCodigo;
    return this.httpClient.get<InstruccionInt>(this.req);
  }
  /**
   * 
   * @param inPer 
   * @returns 
   */
  obternerExperiencia(inPer:string):Observable<ExperienciaInt>{
    this.req=this.url+'obtenerExperiencia?inPersona='+inPer;
    return this.httpClient.get<ExperienciaInt>(this.req);
  }
  /**
   * 
   * @param inPer 
   * @returns 
   */
  obternerFormacion(inPer:string):Observable<FormacionInt>{
    this.req=this.url+'obtenerFormacion?inPersona='+inPer;
    return this.httpClient.get<FormacionInt>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @param inDesde 
   * @param inHasta 
   * @returns 
   */
  obtenerConsolidado(inPersona: String, inDesde: String, inHasta: String): Observable<ConsolidadoInt>{
    this.req = this.url + 'obtenerConsolidado?inPersona=' + inPersona + '&inDesde=' + inDesde + '&inHasta=' + inHasta;
    return this.httpClient.get<ConsolidadoInt>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @param inDesde 
   * @param inHasta 
   * @param inTipo 
   * @returns 
   */
  consolidado(inPersona: String, inDesde: String, inHasta: String, inTipo:String): Observable<ConsolidadoInt>{
    this.req = this.url + 'consolidado?inPersona=' + inPersona + '&inDesde=' + inDesde + '&inHasta=' + inHasta+'&estado='+inTipo;
    return this.httpClient.get<ConsolidadoInt>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @param inEstado 
   * @param inEstado1 
   * @param inDesde 
   * @param inHasta 
   * @returns 
   */
  obtenerPermiso(inPersona: String, inEstado:string,inEstado1:string, inDesde: String, inHasta: String): Observable<PermisosInt>{
    this.req = this.url + 'obtenerPermisos?inPersona=' + inPersona +'&inEstado='+inEstado + '&inEstado1='+inEstado1+ '&inDesde=' + inDesde + '&inHasta=' + inHasta;
    return this.httpClient.get<PermisosInt>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @param inAnio 
   * @param inMes 
   * @returns 
   */
  obtenerAdicional(inPersona: String, inAnio: Number, inMes: Number): Observable<AdicionalInt>{
    this.req = this.url + 'obtenerAdicional?inPersona=' + inPersona + '&inAnio=' + inAnio + '&inMes=' + inMes;
    return this.httpClient.get<AdicionalInt>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @param inAnio 
   * @param inMes 
   * @returns 
   */
  obtenerNocturna(inPersona: String, inAnio: Number, inMes: Number): Observable<NocturnaInt>{
    this.req = this.url + 'obtenerNocturna?inPersona=' + inPersona + '&inAnio=' + inAnio + '&inMes=' + inMes;
    return this.httpClient.get<NocturnaInt>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @param inAnio 
   * @param inMes 
   * @returns 
   */
  obtenerExtraordinaria(inPersona: String, inAnio: Number, inMes: Number): Observable<ExtraordinariaInt>{
    this.req = this.url + 'obtenerExtraordinaria?inPersona=' + inPersona + '&inAnio=' + inAnio + '&inMes=' + inMes;
    return this.httpClient.get<ExtraordinariaInt>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @returns 
   */
  obtenerSolicitud(inPersona:String):Observable<SolicitudesInt>{
    this.req=this.url+'obtenerSolicitudes?inPersona=' + inPersona;
    return this.httpClient.get<SolicitudesInt>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @param inTipo 
   * @param inEstado 
   * @returns 
   */
  obtenerPeriodos(inPersona:string, inTipo: Number,inEstado: Number):Observable<String>{
    this.req=this.url+'obtenerPeriodos?inPersona='+inPersona+'&inTipo='+inTipo+'&inEstado='+inEstado
    return this.httpClient.get<String>(this.req)
  }
  /**
   * 
   * @param inPeriodo 
   * @returns 
   */
  obtenerTotalDias(inPeriodo:string):Observable<String>{
    this.req=this.url+'obtenerTotalDias?inPeriodo=' + inPeriodo
    return this.httpClient.get<String>(this.req)
  }
   /**
   * 
   * @param inPeriodo 
   * @returns 
   */
    obtenerPermisosVacaciones(inPeriodo:string):Observable<TiempoInt>{
      this.req=this.url+'obtenerPermisosVacaciones?inPeriodo=' + inPeriodo
      return this.httpClient.get<TiempoInt>(this.req)
    }
  /**
   * 
   * @param inPeriodo 
   * @returns 
   */
  obtenerLiquidacionTiempo(inPeriodo:string):Observable<TiempoInt>{
    this.req=this.url+'obtenerLiquidacionTiempo?inPeriodo=' + inPeriodo
    return this.httpClient.get<TiempoInt>(this.req)
  }
  /**
   * 
   * @param inPeriodo 
   * @returns 
   */
  obtenerLiquidacionDinero(inPeriodo:string):Observable<DineroInt>{
    this.req=this.url+'obtenerLiquidacionDinero?inPeriodo=' + inPeriodo
    return this.httpClient.get<DineroInt>(this.req)
  }
  /**
   * 
   * @param inPersona 
   * @param inAnio 
   * @param inMes 
   * @returns 
   */
  obtenerNomina(inPersona:String, inAnio:Number, inMes:Number): Observable<NominaInt>{
    this.req=this.url+'obtenerNomina?inPersona='+inPersona+'&inAnio='+inAnio+'&inMes='+inMes;
    return this.httpClient.get<NominaInt>(this.req);
  }
  /**
   * 
   * @param servicio 
   * @param inNomina 
   * @param inPersona 
   * @returns 
   */
  obtenerRol(servicio:string,inNomina:String,inPersona:string):Observable<IngresosInt>{
    this.req=this.url+servicio+'?inNomina='+inNomina+'&inPersona='+inPersona;
    return this.httpClient.get<IngresosInt>(this.req)
  }
  /**
   * 
   * @param inNomina 
   * @param inPersona 
   * @returns 
   */
  obtenerEtnia():Observable<String>{
    this.req=this.url+'obtenerEtnia';
    return this.httpClient.get<string>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @returns 
   */
  obtenerTiempoServicio(inPersona:string):Observable<String>{
    this.req=this.url+'obtenerTiempo?inPersona='+inPersona;
    return this.httpClient.get<string>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @returns 
   */
  obtenerDireccion(inPersona:string):Observable<String>{
    this.req=this.url+'obtenerDireccion?inPersona='+inPersona;
    return this.httpClient.get<string>(this.req);
  }
  /**
   * 
   * @param inPersona 
   * @returns 
   */
  obtenerContactos(inPersona:string):Observable<String>{
    this.req=this.url+'obtenerContactos?inPersona='+inPersona;
    return this.httpClient.get<string>(this.req)
  }
  contacto(inCodigo:string):Observable<String>{
    this.req=this.url+'contacto?inCodigo='+inCodigo;
    return this.httpClient.get<string>(this.req)
  }
  /**
   * 
   * @param inPersona 
   * @returns 
   */
  obtenerInformacionAnticipo(inPersona:string):Observable<InformacionAntInt>{
    this.req=this.url+'obtenerAnticipoInf?inPersona='+inPersona
    return this.httpClient.get<InformacionAntInt>(this.req)
  }
  /**
   * 
   * @param inCodigo 
   * @returns 
   */
  obtenerDetalleAnticipo(inCodigo:string):Observable<DetalleInt>{
    this.req=this.url+'obtenerAnticipoDet?inCodigo='+inCodigo
    return this.httpClient.get<DetalleInt>(this.req)
  }
/**
 * 
 * @param inCod 
 * @returns 
 */
  obtenerAdjuntoInstruccion(inCod: string):Observable<Adjunto> {
    this.req = this.url+'adjuntoInstruccion?inCod='+inCod;
    return this.httpClient.get<Adjunto>(this.req);
  }
  /**
   * 
   * @param inCod 
   * @returns 
   */
  obtenerAdjuntoExperiencia(inCod: string):Observable<Adjunto> {
    this.req = this.url+'adjuntoExperiencia?inCodigo='+inCod;
    return this.httpClient.get<Adjunto>(this.req);
  }
  /**
   * 
   * @param inCod 
   * @returns 
   */
  obtenerAdjuntoPermisos(inCod: string):Observable<Adjunto> {
    this.req = this.url+'adjuntoPermisos?inCodigo='+inCod;
    return this.httpClient.get<Adjunto>(this.req);
  }
  /**
   * 
   * @param inCod 
   * @returns 
   */
  obtenerAdjuntoSolicitudes(inCod: string):Observable<Adjunto> {
    this.req = this.url+'adjuntoSolicitudes?inCodigo='+inCod;
    return this.httpClient.get<Adjunto>(this.req);
  }
  /**
   * 
   * @returns 
   */
  obtenerTipoSanguineo():Observable<String>{
    this.req = this.url+'obtenerTipoSang';
    return this.httpClient.get<String>(this.req)
  }
  /**
   * 
   * @returns 
   */
  obtenerDiscapacidad():Observable<String>{
    this.req = this.url+'obtenerDiscapacidad';
    return this.httpClient.get<String>(this.req)
  }
  /**
   * 
   * @returns 
   */
  obtenerParroquias():Observable<String>{
    this.req = this.url + 'obtenerParroquia'
    return this.httpClient.get<String>(this.req)
  }
    /**
   * 
   * @returns 
   */
     obtenerNivelEducativo():Observable<String>{
      this.req = this.url + 'obtenerNivel'
      return this.httpClient.get<String>(this.req)
    }
    /**
     * 
     * @param codigo 
     * @returns 
     */
    obtenerTitulos(codigo:String):Observable<String>{
      this.req = this.url + 'obtenerTitulo?inCodigo=' + codigo
      return this.httpClient.get<String>(this.req)
    }
    /**
     * 
     * @param json 
     * @returns 
     */
    insertDatos(json:any):Observable<String>{
      const headers = { 'content-type': 'application/json' };
      const body = JSON.parse(json);
      this.req = this.url + 'saveDri_ma_app';
      return this.httpClient.post<String>(this.req, body, { 'headers': headers });
    }    
}
