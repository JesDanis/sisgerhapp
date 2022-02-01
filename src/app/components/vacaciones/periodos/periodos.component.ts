import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.css']
})

export class PeriodosComponent implements OnInit {
  txtEstado:any
  txtTipo:any
  inPer:any
  periodos:any
  dias:any
  txtPeriodo:any
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  tiempo:any
  dinero: any
  constructor(private sisgerhService:SisgerhMovilService) { }
  
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 4,
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
   
  }
  obtenerPeriodos(){
    this.txtEstado=$("#estado").val()
    this.txtTipo=$("#tipo").val()
  this.inPer=localStorage.getItem('codPer');
  this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
  this.periodos=['']
  this.sisgerhService.obtenerPeriodos(btoa(this.inPer),this.txtTipo,this.txtEstado).subscribe(res=>{
    this.periodos=res
  })
  }
  obtenerDatos(){
    this.txtEstado=$("#estado").val()
    this.txtTipo=$("#tipo").val()
    this.txtPeriodo=$("#periodo").val()
    if(this.txtTipo==9){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccionar un Tipo'
      })
    }else if(this.txtEstado==9){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccionar un Estado'
      })
    }else if(this.txtPeriodo==9){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccionar un Periodo'
      })
    }else{
    //DIAS
    this.dias=['']
    this.sisgerhService.obtenerTotalDias(this.txtPeriodo).subscribe(res=>{
      // let dtInstance = $('#tblDias').DataTable();
      // dtInstance.destroy();
      this.dias=res
    })
    //TIEMPO
    this.tiempo=['']
    this.sisgerhService.obtenerLiquidacionTiempo(this.txtPeriodo).subscribe(din=>{
      // let dtInstance = $('#tblTiempo').DataTable();
      // dtInstance.destroy();
      this.tiempo=din
    })
    //DINERO
    this.dinero=['']
    this.sisgerhService.obtenerLiquidacionDinero(this.txtPeriodo).subscribe(tmp=>{
      // let dtInstance = $('#tblDinero').DataTable();
      // dtInstance.destroy();
      this.dinero=tmp
    })
  }
  }
}
