import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'
import {AdministracionService} from 'src/app/guards/administracion.service'


@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent implements OnInit {
  experiencia:any;
  inPer:any;
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
        },{
          targets: [0, 1, 4,6,7],
          className: 'dt-body-left',
        }
        ,{
          targets: [5],
          className: 'dt-body-right',
        }
      ]
    };
    this.getExperiencia();
  }
  getExperiencia(){
    this.inPer=  this.authService.getCodPer()
    this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
    this.experiencia=['']
    this.sisgerhService.obternerExperiencia(btoa(this.inPer)).subscribe(res=>{
      this.experiencia=res;
      this.dtTrigger.next();
    });
  }
  descargar(codigo: string) {
    this.sisgerhService.obtenerAdjuntoExperiencia(codigo).subscribe((response:any) => {
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
