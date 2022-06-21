import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import {AdministracionService} from 'src/app/guards/administracion.service'

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit {
  informacion:any;
  inPer:any;
  tiempo:any

  constructor(private sisgerhService:SisgerhMovilService,private authService:AdministracionService) { }
  
  ngOnInit(): void {
    // this.scrollToBottom();
    this.obtenerInformacion();
    
  }
 
  obtenerInformacion(){
    this.inPer=this.authService.getCodPer()
    this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
    
    this.informacion=[''];
    this.sisgerhService.obternerInformacionPer(btoa(this.inPer)).subscribe(res=>{
      this.informacion=res;
      this.informacion=this.informacion[0];
    });
    this.tiempo = ['']
    this.sisgerhService.obtenerTiempoServicio(btoa(this.inPer)).subscribe(res => {
      this.tiempo = res
    })
  }

}
