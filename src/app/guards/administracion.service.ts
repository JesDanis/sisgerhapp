import { Injectable } from '@angular/core';
import { of } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  isLogin = false;
  constructor() { }

 
  login(inPerson:any,user:any) {
    this.isLogin = true;
    let usuarioSeguridad = inPerson;
    localStorage.setItem('STATE', 'true');
    localStorage.setItem('codPer',inPerson);
    localStorage.setItem('user',user);
    return of({ success: this.isLogin, usuario: usuarioSeguridad });
  }

  logout() {
    this.isLogin = false;
    localStorage.setItem('STATE', 'false');
    localStorage.setItem('user', '');
    localStorage.setItem('codPer','');
    localStorage.setItem('user','');
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
}
