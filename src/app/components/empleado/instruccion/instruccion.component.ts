import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-instruccion',
  templateUrl: './instruccion.component.html',
  styleUrls: ['./instruccion.component.css']
})
export class InstruccionComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  instruccion: any;
  inPer: any;
  archivo: any
  constructor(private sisgerhService: SisgerhMovilService, private domSanitizer: DomSanitizer, private _http: HttpClient) { }

  ngOnInit(): void {
  
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
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
    this.obtenerInstruccion();
  }
  obtenerInstruccion() {
    this.inPer = localStorage.getItem('codPer');
    this.inPer = CryptoJS.AES.decrypt(this.inPer.toString(), 'eeasaPer').toString(CryptoJS.enc.Utf8);
    this.instruccion = ['']
    this.sisgerhService.obternerInstruccion(btoa(this.inPer)).subscribe(res => {
      this.instruccion = res;
      this.dtTrigger.next();
    });
  }

  descargar(codigo: string) {
    this.sisgerhService.obtenerAdjuntoInstruccion(codigo).subscribe((response:any) => {
    
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