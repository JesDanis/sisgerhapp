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
  codigo:any
  cod_adj:any
  hora_inicio:any
  hora_fin:any
  horas_total:any
  dias_soli:any
  dias_perm:any
  modalidad:any
  remplazo:any
  dias_ord_lab:any
  dias_ord_no_lab:any
  dias_adi_lab:any
  dias_adi_no_lab:any
  constructor(private datePipe: DatePipe,private sisgerhService:SisgerhMovilService) { }

  ngOnInit(): void {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
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
            "targets": [1,6],
            "orderable": false
          },
          {
            targets: [0, 1, 2],
            className: 'dt-body-left',
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
          text: 'No se encuentra un documento adjunto'
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
  var a = document.createElement("a");
  a.href = url;
  a.target = '_blank';
  a.click();
  // var anchor = document.createElement("a");
  // anchor.download = response[0].NOMBRE;
  // anchor.href = url;
  // anchor.click();
      }
     
    })
  }
  obtenerInformacion(cod_adj:string,cod:string
    ,h_in:string,
    h_fin:string,
    h_t:string,
    dias_sol:string,
    dias_per:string,
    mod:string,
    remp:string,
    dias_ord_lab:string,
    dias_ord_no_lab:string,
    dias_adi_lab:string,
    dias_adi_no_lab:string
    ){
  this.codigo=cod
  this.cod_adj=cod_adj
  this.hora_inicio=h_in
  this.hora_fin=h_fin
  this.horas_total=h_t
  this.dias_soli=dias_sol
  this.dias_perm=dias_per
  this.modalidad=mod
  this.remplazo=remp
  this.dias_adi_lab=dias_adi_lab
  this.dias_adi_no_lab=dias_adi_no_lab
  this.dias_ord_lab=dias_ord_lab
  this.dias_ord_no_lab=dias_ord_no_lab
  if(h_in==null){
    $("#horas").hide()
  }else{
    $("#horas").show()
  }
  if(remp==' '){
    $("#remplazo").hide()
  }else
  $("#remplazo").show()

  }
}
