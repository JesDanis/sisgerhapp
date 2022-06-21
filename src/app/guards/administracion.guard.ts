import { Injectable } from '@angular/core';
import { Router,ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, CanLoad,UrlSegment } from '@angular/router';
import {AdministracionService} from 'src/app/guards/administracion.service'
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { Observable } from "rxjs";
import { Route } from "@angular/compiler/src/core";


@Injectable({
  providedIn: 'root'
})
export class AdministracionGuard implements CanActivate,CanLoad {
  respuesta:boolean=false
  inUser:any
  constructor(private router:Router,private sisgerhService:SisgerhMovilService, private authService:AdministracionService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.authService.isLoggedIn()) {
      this.inUser = this.authService.getUser()   
      this.inUser = CryptoJS.AES.decrypt(this.inUser.toString(), 'eeasaPer').toString(CryptoJS.enc.Utf8);
     
        this.sisgerhService.obtenerPerfil(this.inUser).subscribe((res:any)=>{
          if(res[0].respuesta=='NO'){
           
            this.router.navigate(['/index']);
            this.respuesta= false;
            
          }else{
            this.respuesta= true;
          }
        })
       
        return this.respuesta;
    }

    window.location.href = 'http://172.20.0.84:7001/intranet#/';
    return false;
  }

}
