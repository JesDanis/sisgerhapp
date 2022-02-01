import { Injectable } from '@angular/core';
import { Router,ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class AdministracionGuard implements CanActivate {
  respuesta:boolean=false
  inUser:any
  constructor(private router:Router,private sisgerhService:SisgerhMovilService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean  {
      this.inUser = localStorage.getItem('user');
    this.inUser = CryptoJS.AES.decrypt(this.inUser.toString(), 'eeasaPer').toString(CryptoJS.enc.Utf8);
   
      this.sisgerhService.obtenerPerfil(this.inUser).subscribe((res:any)=>{
        if(res[0].respuesta=='NO'){
         
          this.router.navigate(['empleado']);
          this.respuesta= false;
        }else{
          this.respuesta= true;
        }
      })
      return this.respuesta;
  }
  
}
