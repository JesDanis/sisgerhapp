import { Component, OnInit } from '@angular/core';
import {DatePipe} from '@angular/common';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})

export class PermisosComponent implements OnInit {
  inDesde:any
  inHasta:any
  inPer:any
  permisos:any
  fecha!:Date;
  inEstado:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  actual:any
  constructor(private datePipe: DatePipe,private sisgerhService:SisgerhMovilService) { }

  ngOnInit(): void {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 3,
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
    
    this.actual =this.datePipe.transform(this.fecha,"yyyy-MM-dd");
    let tmpFecha=new Date();
    this.inDesde =this.datePipe.transform((tmpFecha.getFullYear()+"-"+(tmpFecha.getMonth() +1) +"-"+ 1),'yyyy-MM-dd');
  }
  obtenerPermisos(){
  let Desde: string|any = $("#fechaInicio").val();
  let Hasta: string|any = $("#fechaFin").val();
  
  this.inEstado=Number($("#estado").val())
  this.inPer=localStorage.getItem('codPer');
  this.inDesde=this.datePipe.transform(Desde,"yyyy-MM-dd");
  this.inHasta=this.datePipe.transform(Hasta,"yyyy-MM-dd");
  if(this.inEstado==9){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Seleccionar un Estado'
    })
  }else if(this.inDesde > this.inHasta ){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Fecha de inicio no puede ser mayor a la fecha fin'
    })
  }else if (this.inDesde==null || this.inHasta==null) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ingresar una fecha'
    })
  } else {
  this.inDesde=this.datePipe.transform(Desde,"dd/MM/yyyy");
  this.inHasta=this.datePipe.transform(Hasta,"dd/MM/yyyy");
  this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
  this.permisos=[''];
  if(this.inEstado==5){
    this.sisgerhService.obtenerPermiso(btoa(this.inPer),"0","4",this.inDesde,this.inHasta).subscribe(res=>{
      let dtInstance = $('#tblPermisos').DataTable();
      dtInstance.destroy();
      this.permisos=res;

      this.dtTrigger.next();
    })
  }  else{
    this.sisgerhService.obtenerPermiso(btoa(this.inPer),this.inEstado,this.inEstado,this.inDesde,this.inHasta).subscribe(res=>{
      this.permisos=res;
      this.dtTrigger.next();
    })
  }}
  let tmpFecha=new Date();
  this.inDesde =this.datePipe.transform((tmpFecha.getFullYear()+"-"+(tmpFecha.getMonth() +1) +"-"+ 1),'yyyy-MM-dd');

  }
  descargar(codigo: string) {
    this.sisgerhService.obtenerAdjuntoPermisos(codigo).subscribe((response:any) => {
      if (response[0].ADJUNTO==null){
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'No se encuentra un adjunto, actualizar el archivo'
        })
      }else{
        var bstr = atob(response[0].ADJUNTO),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

  let file = new File([u8arr], response[0].NOMBRE, {type:'application/pdf'});
  var url = window.URL.createObjectURL(file);
  var anchor = document.createElement("a");
  anchor.download = response[0].NOMBRE;
  anchor.href = url;
  anchor.click();
      }
     
    })
  }
}
