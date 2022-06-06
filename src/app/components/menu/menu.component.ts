import { Component, OnInit  } from "@angular/core"; 
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import { DomSanitizer } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
import { Router} from '@angular/router';
import {AdministracionService} from 'src/app/guards/administracion.service'

import { CookieService } from 'ngx-cookie-service';
@Component({
    selector: 'app-menu',
    templateUrl:'./menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  sesion:any;
  fotografia:any;
  imageUrl:any;
  inPerson:any;
  sidebarShow:boolean = true;
  user:any
  constructor(private cookieService: CookieService,
    private sisgerhService:SisgerhMovilService, 
    private domSanitizer:DomSanitizer,
    private router: Router,
    private authService:AdministracionService
    ) { }

  ngOnInit(): void {
    this.obtenerSesion();  
  }
 obtenerSesion(){
    this.sesion=[''];
    let inUser='dcadme'
  //  let inUser = this.cookieService.get('user_eeasa');

    this.sisgerhService.obtenerSesion(btoa(inUser)).subscribe(res=>{
     
    this.sesion=res;
    this.sesion=this.sesion[0];
    //Obtener DMPER_CODIGO
    this.inPerson=this.sesion.DMPER_CODIGO;
    this.inPerson=CryptoJS.AES.encrypt(this.inPerson.toString(),'eeasaPer');
    this.user=CryptoJS.AES.encrypt(inUser,'eeasaPer');
    this.authService.login(this.inPerson,this.user);
    
    //Cargar fotogafria
    this.fotografia=this.sesion.DMPER_FOTOGRAFIA;
    let TYPED_ARRAY = new Uint8Array(this.fotografia);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
      return data + String.fromCharCode(byte);
      }, '');
      let base64String = btoa(STRING_CHAR);
      this.imageUrl = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + base64String);
    }); 
    this.sisgerhService.obtenerPerfil(inUser).subscribe((res:any)=>{
      if(res[0].respuesta=='SI'){
        jQuery("#menuAdmin").css("visibility", "visible");
      }else{
        jQuery("#menuAdmin").css("visibility", "hidden");
      }
    })
    
  } 
  sidebar() {
    if(this.sidebarShow) {
      jQuery('.largeTable').width('96vw');
      this.sidebarShow = false;
    } else {
      jQuery('.largeTable').width('80vw');
      this.sidebarShow = true;
    }
  }
  salir(){
    this.authService.logout();
    //window.location.href = 'https://app.eeasa.com.ec/intranet#/';
    window.location.href = 'http://172.20.0.84:7001/intranet#/';
   
  }
 
  }
  