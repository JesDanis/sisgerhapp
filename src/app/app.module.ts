import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { InformacionComponent } from './components/empleado/informacion/informacion.component';
import { RouterModule,Routes } from '@angular/router';
import { InstruccionComponent } from './components/empleado/instruccion/instruccion.component';
import { ExperienciaComponent } from './components/empleado/experiencia/experiencia.component';
import { FormacionComponent } from './components/empleado/formacion/formacion.component';
import { ConsolidadoComponent } from './components/asistencia/consolidado/consolidado.component';
import { PermisosComponent } from './components/asistencia/permisos/permisos.component';
import { SobretiemposComponent } from './components/asistencia/sobretiempos/sobretiempos.component';
import { SolicitudesComponent } from './components/vacaciones/solicitudes/solicitudes.component';
import { RolesPagoComponent } from './components/roles-pago/roles-pago.component';
import { AnticipoRmuComponent } from './components/anticipo-rmu/anticipo-rmu.component';
import { PeriodosComponent } from './components/vacaciones/periodos/periodos.component';
import { ActualizacionComponent } from './components/empleado/actualizacion/actualizacion.component';
import { FormsModule, NgModel,ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";
import { PrincipalComponent } from './components/administracion/principal/principal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import { AdministracionGuard } from './guards/administracion.guard';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

const routes: Routes=[
  
  {path:'',redirectTo:'empleado',pathMatch:'full'},
  {path:'empleado',component:InformacionComponent},
  {path:'instruccion', component:InstruccionComponent},
  {path:'experiencia', component:ExperienciaComponent},
  {path:'formacion', component:FormacionComponent},
  {path:'consolidado',component:ConsolidadoComponent},
  {path:'permisos',component:PermisosComponent},
  {path:'sobretiempos',component:SobretiemposComponent},
  {path:'solicitudes', component:SolicitudesComponent},
 {path:'periodos', component:PeriodosComponent},
  {path:'rolesPago', component:RolesPagoComponent},
  {path:'anticipoRmu',component:AnticipoRmuComponent},
  {path:'actualizacion',component:ActualizacionComponent},
  {path:'principal-admi',component:PrincipalComponent,canActivate:[AdministracionGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    InformacionComponent,
    InstruccionComponent,
    ExperienciaComponent,
    FormacionComponent,
    ConsolidadoComponent,
    PermisosComponent,
    SobretiemposComponent,
    SolicitudesComponent,
    RolesPagoComponent,
    AnticipoRmuComponent,
    PeriodosComponent,
    ActualizacionComponent,
    PrincipalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes,{ useHash: false, onSameUrlNavigation: "reload" }),
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    DataTablesModule,
     ReactiveFormsModule,
      NgSelectModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      })
  ],
  providers: [DatePipe,CookieService,
  {provide:LocationStrategy,useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
