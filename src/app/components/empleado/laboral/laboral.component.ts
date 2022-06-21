import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import {AdministracionService} from 'src/app/guards/administracion.service'

import { CookieService } from 'ngx-cookie-service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-laboral',
  templateUrl: './laboral.component.html',
  styleUrls: ['./laboral.component.css']
})
export class LaboralComponent implements OnInit {
  informacion:any;
  inPer:any;
  tiempo:any
  abrev:any
  empleado:any
  rol:any
  cargo:any
  zona:any
  regimen:any
  escala:any
  contrato:any
  rmu:any
  dpto:any
  dep:any
  ubi_int:any
  fec_ant:any
  fec_ing:any
  fec_sal:any
  tel_trab:any
  ext_trab:any
  email:any
  anios:any
  meses:any
  dias:any
  
  constructor(private sisgerhService:SisgerhMovilService,private authService:AdministracionService,private cookieService:CookieService) { }
  
  async ngOnInit(){
   this.datos()
  }
async datos(){
// this.inPer=this.authService.getCodPer()   
  this.inPer =  localStorage.getItem('codPer')
 
    
  if(this.inPer ==null || this.inPer==undefined){
    window.location.reload()

  }else{
    let response:any
    this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
    this.sisgerhService.obternerInformacionPer(btoa(this.inPer)).subscribe(
      response=>{
        this.informacion=[''];
        this.informacion=response[0];
        this.abrev=this.informacion.ABREVIATURA
        this.empleado=this.informacion.NOMBRE_EMPLEADO
        this.rol=this.informacion.ROL
        this.cargo=this.informacion.CARGO
        this.zona=this.informacion.ZONA
        this.regimen=this.informacion.REGIMEN_LABORAL
        this.escala=this.informacion.NUM_ESCALA
        this.contrato=this.informacion.CONTRATO
        this.rmu=this.informacion.RMU
        this.dpto=this.informacion.DEPARTAMENTO
        this.dep=this.informacion.ESTRUCTURA
        this.ubi_int=this.informacion.UBICACION_INTERNA
        this.fec_ant=this.informacion.FECHA_PAGO_ANT
        this.fec_ing=this.informacion.FECHA_INGRESO
        this.fec_sal=this.informacion.FECHA_SALIDA
        this.tel_trab=this.informacion.TELF_TRABAJO
        this.ext_trab=this.informacion.EXT_TRABAJO
        this.email=this.informacion.EMAIL
      }
    );
        


}
this.tiempo = ['']
let responseT = await this.sisgerhService.obtenerTiempoServicio(btoa(this.inPer)).toPromise();


this.tiempo = responseT
this.anios=this.tiempo.anios
this.meses=this.tiempo.meses
this.dias=this.tiempo.dias
}
}
