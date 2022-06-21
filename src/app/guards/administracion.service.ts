import { Injectable } from '@angular/core';
import { of } from "rxjs";
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  isLogin = false;
  constructor(private cookieService:CookieService) { }
 
 
  login(inPerson:any,user:any) {
    this.isLogin = true;
    localStorage.setItem('STATE', 'true');
    localStorage.setItem('codPer',inPerson);
    localStorage.setItem('user',user);
    return of({ success: this.isLogin, usuario: user });
  } 

  logout() {
    this.isLogin = false;
    localStorage.setItem('STATE', 'false');
    // localStorage.setItem('user', '');
    // localStorage.setItem('codPer','');
    localStorage.removeItem("user");
    localStorage.removeItem("codPer");
    localStorage.removeItem("usuario");
    this.cookieService.delete('user_eeasa');

    document.cookie = "user_eeasa=;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    return of({ success: this.isLogin, usuario: '' });
  }

  isLoggedIn() {
    const loggedIn = localStorage.getItem('STATE');
    if (loggedIn == 'true') {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    return this.isLogin;
  }
  getCodPer() {
    let usuario = localStorage.getItem('codPer');
    if(usuario) {
      return usuario;
    } else {
      return '';
    }
  }
  getUser() {
    let usuario = localStorage.getItem('user');
    if(usuario) {
      return usuario;
    } else {
      return '';
    }
  }
}
