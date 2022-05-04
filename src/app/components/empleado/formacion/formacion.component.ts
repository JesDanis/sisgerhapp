import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-formacion',
  templateUrl: './formacion.component.html',
  styleUrls: ['./formacion.component.css']
})
export class FormacionComponent implements OnInit {
  formacion:any;
  inPer:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
 
  constructor(private sisgerhService:SisgerhMovilService){}
  

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
          "targets": [0,3],
          "orderable": false
        },
        {
          targets: [0, 1, 3,4,5],
          className: 'dt-body-left',
        },
        {
          targets: [2],
          className: 'dt-body-right',
        }
      ]
    };
    this.getFormacion();
  }
  getFormacion(){
    this.inPer=localStorage.getItem('codPer');
    this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
    this.formacion=['']
    this.sisgerhService.obternerFormacion(btoa(this.inPer)).subscribe(res=>{
      this.formacion=res;
      this.dtTrigger.next();
    });
  }

}
