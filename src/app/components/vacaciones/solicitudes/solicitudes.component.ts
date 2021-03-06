import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'
import {AdministracionService} from 'src/app/guards/administracion.service'


@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  inPer:any;
  solicitud:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private sisgerhService:SisgerhMovilService,private authService:AdministracionService) { }

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
          "targets": [8],
          "orderable": false
        },
        {
          targets: [0, 1, 2,3],
          className: 'dt-body-left',
        },
        {
          targets: [4],
          className: 'dt-body-right',
        }
      ]
    };
    this.getSolicitud();
  }
  getSolicitud(){
    this.inPer=this.authService.getCodPer()
    this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
    this.solicitud=['']
    this.sisgerhService.obtenerSolicitud(btoa(this.inPer)).subscribe(res=>{
      this.solicitud=res;
      console.log(this.solicitud)
      this.dtTrigger.next();
    });
  }

  descargar(codigo: string) {
    this.sisgerhService.obtenerAdjuntoSolicitudes(codigo).subscribe((response:any) => {
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
}
 