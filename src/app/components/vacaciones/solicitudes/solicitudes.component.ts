import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'
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
    this.getSolicitud();
  }
  getSolicitud(){
    this.inPer=localStorage.getItem('codPer');
    this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
    this.solicitud=['']
    this.sisgerhService.obtenerSolicitud(btoa(this.inPer)).subscribe(res=>{
      this.solicitud=res;
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
  var anchor = document.createElement("a");
  anchor.download = response[0].NOMBRE;
  anchor.href = url;
  anchor.click();
      }
     
    })
  }
}
 