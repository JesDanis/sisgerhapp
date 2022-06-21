import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'
import {AdministracionService} from 'src/app/guards/administracion.service'

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
  porcentaje_ordinario_lab:number=0
  porcentaje_ordinario_nolab:number=0
  porcentaje_adicional_lab:number=0
  porcentaje_adicional_nolab:number=0
  permisos:any

  constructor(private sisgerhService:SisgerhMovilService,private authService:AdministracionService) { }
  
  ngOnInit(): void {
    this.obtener_periodos()
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
  obtener_periodos(){
    this.inPer=this.authService.getCodPer()
    this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
    this.periodos=['']
    this.sisgerhService.obtenerPeriodos(btoa(this.inPer),3,3).subscribe(res=>{
      this.periodos=res
    })
   
  }
  obtenerPeriodos(){
    this.txtEstado=$("#estado").val()
    this.txtTipo=$("#tipo").val()
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
       //PROGRESS BAR
     document.getElementById('ordinarios_lab')?.setAttribute('aria-valuemax', this.dias[0].DCPVC_ORD_LAB);
    // if(this.dias[0].DCPVC_ORD_LAB_DISP=="0"){
    //   document.getElementById('ordinarios_lab')?.setAttribute('aria-valuenow', "5");
    //  this.porcentaje_ordinario_lab=10
    // }else{
      document.getElementById('ordinarios_lab')?.setAttribute('aria-valuenow', this.dias[0].DCPVC_ORD_LAB_DISP);
     this.porcentaje_ordinario_lab=(Number(this.dias[0].DCPVC_ORD_LAB_DISP)*100)/(Number( this.dias[0].DCPVC_ORD_LAB))
    // }

     document.getElementById('ordinarios_nolab')?.setAttribute('aria-valuemax', this.dias[0].DCPVC_ORD_NLAB);
    //  if(this.dias[0].DCPVC_ORD_NLAB_DISP=="0"){
    //   document.getElementById('ordinarios_nolab')?.setAttribute('aria-valuenow', "5");
    //  this.porcentaje_ordinario_nolab=10
    // }else{
      document.getElementById('ordinarios_nolab')?.setAttribute('aria-valuenow', this.dias[0].DCPVC_ORD_NLAB_DISP);
      this.porcentaje_ordinario_nolab=(Number(this.dias[0].DCPVC_ORD_NLAB_DISP)*100)/(Number( this.dias[0].DCPVC_ORD_NLAB))
    // }

    document.getElementById('adicionales_lab')?.setAttribute('aria-valuemax', this.dias[0].DCPVC_ADS_LAB);
      document.getElementById('adicionales_lab')?.setAttribute('aria-valuenow', this.dias[0].DCPVC_ADS_LAB_DISP);
      this.porcentaje_adicional_lab=(Number(this.dias[0].DCPVC_ADS_LAB_DISP)*100)/(Number( this.dias[0].DCPVC_ADS_LAB))

      document.getElementById('adicionales_nolab')?.setAttribute('aria-valuemax', this.dias[0].DCPVC_ADS_NLAB);
      document.getElementById('adicionales_nolab')?.setAttribute('aria-valuenow', this.dias[0].DCPVC_ADS_NLAB_DISP);
      this.porcentaje_adicional_nolab=(Number(this.dias[0].DCPVC_ADS_NLAB_DISP)*100)/(Number( this.dias[0].DCPVC_ADS_NLAB))
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
    //PERMISOS
    this.permisos=['']
    this.sisgerhService.obtenerPermisosVacaciones(this.txtPeriodo).subscribe(prm=>{
      this.permisos=prm
 
    })
  }
  }
}
