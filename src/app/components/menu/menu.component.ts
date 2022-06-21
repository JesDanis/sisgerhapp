import { Component, OnInit  } from "@angular/core"; 
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import { DomSanitizer } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
import {AdministracionService} from 'src/app/guards/administracion.service'
import { ActivatedRoute,Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { LaboralComponent } from "../empleado/laboral/laboral.component";
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
  color:any
  num_rol:any
  empleado:any
  cuenta:any
  constructor(
    private sisgerhService:SisgerhMovilService, 
    private domSanitizer:DomSanitizer,
    private authService:AdministracionService,
    public router: Router,
  ){}
    

    async ngOnInit() {
      $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
      });
  
     //localStorage.setItem('usuario',' ')
      let inUser = localStorage.getItem('usuario');
      if(inUser){
        let response:any
        response = await this.sisgerhService.obtenerSesion(btoa(inUser)).toPromise();
        if(response[0].DMPER_CODIGO != undefined){

          this.sesion=[''];   
          this.sesion=response;
          this.sesion=this.sesion[0];
          //Obtener DMPER_CODIGO
          this.color=this.sesion.COLOR_ESCALA
          this.num_rol=this.sesion.DMPER_NUMERO_ROL
          this.empleado=this.sesion.DMPER_NOMBRE_EMPLEADO
        localStorage.setItem('nombre',(this.sesion.DMPER_NOMBRE_EMPLEADO))

          this.cuenta=this.sesion.DSGUS_CUENTA
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
      
          this.sisgerhService.obtenerPerfil(inUser).subscribe((res:any)=>{
    
            // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            // this.router.onSameUrlNavigation
            // this.router.onSameUrlNavigation = 'reload';
           // this.router.navigate([currentUrl]);
            this.router.navigate(['/index']);
            if(res[0].respuesta=='SI'){
              jQuery("#menuAdmin").css("visibility", "visible");
          

            }else{
              jQuery("#menuAdmin").css("visibility", "hidden");
            

            }
          })
        }
        }else{
          this.salir()
          window.location.href = 'http://172.20.0.84:7001/intranet#/';

        }
     
     
      
      }


 
  salir(){
    this.authService.logout();
    //window.location.href = 'https://app.eeasa.com.ec/intranet#/';
    window.location.href = 'http://172.20.0.84:7001/intranet#/';
   
  }

  }
  