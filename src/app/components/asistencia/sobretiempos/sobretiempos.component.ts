import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import {DatePipe} from '@angular/common';
import {Meses} from 'src/app/models/meses'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-sobretiempos',
  templateUrl: './sobretiempos.component.html',
  styleUrls: ['./sobretiempos.component.css']
})
export class SobretiemposComponent implements OnInit {
inAnio:number=0;
inMes:number=0;
inPer:any;
adicional:any;
nocturna:any;
extraordinaria:any;
fecha!:Date;
anio:any
mes:any
mesActual:any
meses: any[] = [];
dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject<any>();
  constructor(private datePipe: DatePipe,private sisgerhService:SisgerhMovilService) { }

  ngOnInit(): void {
    this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 2,
    info: true,
    processing: true,
    ordering: true,
    order: [],
    language: {
      "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
    },
    responsive: true,
    retrieve: true,
    "columnDefs": [
      {
        "targets": [0],
        "orderable": false
      }
    ]
  };
  this.fecha = new Date();
  fecha : '' 
  this.anio=this.datePipe.transform(this.fecha,"yyyy");
  this.mes=this.datePipe.transform(this.fecha,"MM");
   this.obtenerMeses()
  }
  obtenerMeses(): void {
    for (let mes in Meses) {
      if (isNaN(Number(mes))) {
        this.meses.push({ text: mes, value: Meses[mes] });
      }
    }
    this.mesActual = Number(((new Date).getMonth()) + 1).toString();

  }
obtenerSobretiempos():void{

  this.inAnio=Number($("#inAnio").val());
 this.inMes=Number($("#inMes").val())
 if(this.inAnio== this.anio && this.inMes>this.mesActual){
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Mes seleccionado fuera de límite'
  })
 }else if(this.inAnio==0 || this.inAnio>this.anio){
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Año incorrecto'
  })
 }
 else{
 this.inPer=localStorage.getItem('codPer');
 this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);  
/*ADICIONAL */
this.adicional=[''];
this.sisgerhService.obtenerAdicional(this.inPer,this.inAnio,this.inMes).subscribe(res=>{
  let dtInstance = $('#tblAdicional').DataTable();
      dtInstance.destroy();
  this.adicional=res;
  this.dtTrigger.next();
});
/*NOCTURNA */
this.nocturna=[''];
this.sisgerhService.obtenerNocturna(this.inPer,this.inAnio,this.inMes).subscribe(res=>{
  let dtInstance = $('#tblNocturna').DataTable();
      dtInstance.destroy();
  this.nocturna=res;
  this.dtTrigger.next();
});
/*EXTRAORDINARIA */
this.extraordinaria=[''];
this.sisgerhService.obtenerExtraordinaria(this.inPer,this.inAnio,this.inMes).subscribe(res=>{
  let dtInstance = $('#tblExtras').DataTable();
      dtInstance.destroy();
  this.extraordinaria=res;
  this.dtTrigger.next();
});
} }
}
