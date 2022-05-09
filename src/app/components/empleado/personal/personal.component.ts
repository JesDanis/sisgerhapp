import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  informacion:any;
  inPer:any;
  tiempo:any
  fecha:any
  direccion:any
  discapacidad:any

  constructor(private sisgerhService:SisgerhMovilService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    // this.scrollToBottom();
    this.obtenerInformacion();
    
  }
  obtenerInformacion(){
    //date:'longDate'
    this.inPer=localStorage.getItem('codPer');
    this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
    
    this.informacion=[''];
    this.sisgerhService.obternerInformacionPer(btoa(this.inPer)).subscribe(res=>{
      this.informacion=res;
      this.informacion=this.informacion[0];
      var fecha=this.informacion.FECHA_NACIMIENTO
      var splitted = fecha.split("/", 3); 
      this.fecha=splitted[1]+'-'+splitted[0]+'-'+splitted[2]
      //this.datePipe = new DatePipe('en-US');
      this.fecha =this.datePipe.transform(this.fecha,"MMMM d, y");
      this.fecha=this.fecha.toUpperCase()
      this.direccion=this.informacion.LUGAR_DOMICILIO+'\n'+this.informacion.DIR_DOMICILIO
      if(this.informacion.DISCAPACIDAD==" "){
        this.discapacidad='NINGUNA - 0%'
      }else{
        this.discapacidad=this.informacion.DISCAPACIDAD+' - '+this.informacion.PORCENTAJE+'%'
      }
    });
    this.tiempo = ['']
    this.sisgerhService.obtenerTiempoServicio(btoa(this.inPer)).subscribe(res => {
      this.tiempo = res
    })
  }

}
