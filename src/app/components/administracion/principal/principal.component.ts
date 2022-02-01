import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SisgerhAdminService } from 'src/app/services/sisgerh-admin.service';
import Swal from 'sweetalert2'
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  inUser:any
  listado: any
  nomnbresEmpleado: any
  datos: any
  lstGeneraral: any
  lstContactos: any
  lstDomicilio: any
  lstInstruccion: any
  lstAdicional: any
  lstAdjuntos: any
  estCivil: any
  genero: any
  etnia: any
  tipoSang: any
  discapacidad: any
  datoContacto: any
  callePrin: any
  calleSec: any
  referencia: any
  numCasa: any
  divPol: any
  parroquia: any
  datoInstruccion: any
  nombrePadre: any
  vivePadre: any
  nombreMadre: any
  viveMadre: any
  nombreCony: any
  trabajaCony: any
  lugarCony: any
  cedula:any
  nombreCedula:any
  papeleta:any
  nombrePapeleta:any
  disc:any
  nombreDisc:any
  getIp:any
  codigo:any
  inPer:any
  txtObservacion:any
  constructor(private sisgerhService: SisgerhAdminService) { }

  ngOnInit(): void {
    this.sisgerhService.getIPAddress().subscribe((res:any)=>{
      this.getIp=res.ip
    })
    this.inPer = localStorage.getItem('codPer');
    this.inPer = CryptoJS.AES.decrypt(this.inPer.toString(), 'eeasaPer').toString(CryptoJS.enc.Utf8);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
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
    this.obtenerListado()
  }
  obtenerListado() {
    this.listado = ['']
    this.sisgerhService.obtenerListado().subscribe(r => {
      this.listado = r;
      this.dtTrigger.next();
    });
  }
  visualizarInformacion(dato: any, nombre: any) {
    this.nomnbresEmpleado = nombre
    this.codigo=dato
    this.lstGeneraral = ['']
    this.lstContactos = ['']
    this.sisgerhService.obtenerDatos(dato).subscribe((res: any) => {
      let n = res.slice(18, -1)
      this.datos = JSON.parse(n);
      this.lstGeneraral = this.datos["GENERAL"]
      this.obtenerGeneral()
      this.lstContactos = this.datos["CONTACTO"]
      this.lstDomicilio = this.datos["DOMICILIARIA"]
      this.lstInstruccion = this.datos["ACADEMICA"]
      this.lstAdicional = this.datos["ADICIONAL"]
      this.lstAdjuntos = this.datos["ADJUNTOS"]
    

      this.obtenerContacto()
      this.obtenerDomicilio()
      this.obtenerInstruccion()
      this.obtenerAdicional()
      this.obtenerAdjuntos()

    })
  }
  obtenerGeneral() {
    if (this.lstGeneraral.DMPER_ESTADO_CIVIL == 1) {
      this.estCivil = "CASADO"
    } else if (this.lstGeneraral.DMPER_ESTADO_CIVIL == 0) {
      this.estCivil = "SOLTERO"
    } else if (this.lstGeneraral.DMPER_ESTADO_CIVIL == 2) {
      this.estCivil = "DIVORCIADO"
    } else if (this.lstGeneraral.DMPER_ESTADO_CIVIL == 3) {
      this.estCivil = "UNIÓN LIBRE"
    } else if (this.lstGeneraral.DMPER_ESTADO_CIVIL == 4) {
      this.estCivil = "VIUDO"
    }
    if (this.lstGeneraral.DMPER_GENERO == 0) {
      this.genero = "MASCULINO"
    } else {
      this.genero = "FEMENINO"
    }
    this.sisgerhService.obtenerEtnia(this.lstGeneraral.DMETI_CODIGO).subscribe((res: any) => {
      this.etnia = res[0].DMETI_DESCRIPCION
    })
    this.sisgerhService.obtenerTipoS(this.lstGeneraral.DMGTS_CODIGO).subscribe((res: any) => {
      this.tipoSang = res[0].DMGTS_OBSERVACION
    })
    this.discapacidad = this.lstGeneraral.DMDSC_CODIGO
    if (this.discapacidad == ' ') {
      $("#divDiscapacidad").hide()
    } else {
      $("#divDiscapacidad").show()
    }

  }
  obtenerContacto() {
    this.datoContacto = []
    let v = this.lstContactos
    let op = ""
    for (let index = 0; index < v.length; index++) {
      this.sisgerhService.obtenerContacto(v[index].DTCON_CODIGO).subscribe((res: any) => {
        if (v[index].DPCNT_OPERADORA == 1) {
          op = "CNT"
        } else if (v[index].DPCNT_OPERADORA == 2) {
          op = "MOVISTAR"
        } else if (v[index].DPCNT_OPERADORA == 3) {
          op = "CLARO"
        } else if (v[index].DPCNT_OPERADORA == 4) {
          op = "OTROS"
        } else if (v[index].DPCNT_OPERADORA == 5) {
          op = "FIJO"
        } else if (v[index].DPCNT_OPERADORA == 0) {
          op = ""
        }
        this.datoContacto.push({ "contacto": res[0].DTCON_DESCRIPCION, "descripcion": v[index].DPCNT_DESCRIPCION, "operadora": op, "principal": v[index].DPCNT_PRINCIPAL })
      })
    }

  }
  obtenerDomicilio() {
    this.callePrin = this.lstDomicilio.DMDRC_CALLE_PRINCIPAL
    this.calleSec = this.lstDomicilio.DMDRC_CALLE_SEGUNDA
    this.numCasa = this.lstDomicilio.DMDRC_NUMERO_CASA
    this.referencia = this.lstDomicilio.DMDRC_REFERENCIA
    this.sisgerhService.obtenerDivision(this.lstDomicilio.DMDIV_CODIGO).subscribe((res: any) => {
      this.divPol = res[0].DIVISION
      this.parroquia = res[0].PARROQUIA
    })
  }
  obtenerInstruccion() {
    this.datoInstruccion = []
    let v = this.lstInstruccion
    for (let index = 0; index < v.length; index++) {
      this.sisgerhService.obtenerInstruccion(v[index].DMNED_CODIGO, v[index].DSLTT_CODIGO).subscribe((res: any) => {
        this.datoInstruccion.push({ "NIVEL": res[0].DMNED_DESCRIPCION, "TITULO": res[0].TITULO, "ESPECIALIDAD": v[index].DSLTT_ESPECIALIDAD, "FECHA": v[index].DSLTT_FECHA, "ADJUNTO": v[index].DSLPT_ADJUNTO, "NOMBRE": v[index].DSLPT_NOMBRE_ADJ })
      })
    }
  }
  obtenerAdicional() {
    this.nombrePadre = this.lstAdicional.DMPER_NOMBRE_PADRE
    this.nombreMadre = this.lstAdicional.DMPER_NOMBRE_MADRE
    this.nombreCony = this.lstAdicional.DMPER_NOMBRE_CNY
    this.vivePadre = this.lstAdicional.DMPER_PADRE_VIVE
    this.viveMadre = this.lstAdicional.DMPER_MADRE_VIVE
    this.trabajaCony = this.lstAdicional.DMPER_TRAB_CONYUGUE
    if (this.trabajaCony == "1") {
      $("#divInstitucion").show()
      this.lugarCony = this.lstAdicional.DMPER_LUGAR_TRAB_CNY
    } else {
      $("#divInstitucion").hide()
      this.lugarCony = ""
    }
  }
  obtenerAdjuntos(){
    let v=this.lstAdjuntos
    //DCFTD13
    for (let index = 0; index < v.length; index++) {
      if(v[index].DCFTD_CODIGO=="DCFTD3"){
        this.cedula= this.lstAdjuntos[index].DMDAJ_DOCUMENTO
        this.nombreCedula= this.lstAdjuntos[index].DMDAJ_NOMBRE

      }
      if(v[index].DCFTD_CODIGO=="DCFTD13"){
        this.papeleta= this.lstAdjuntos[index].DMDAJ_DOCUMENTO
        this.nombrePapeleta=this.lstAdjuntos[index].DMDAJ_NOMBRE
      }
      if(v[index].DCFTD_CODIGO=="DCFTD7"){
        this.disc= this.lstAdjuntos[index].DMDAJ_DOCUMENTO
        this.nombreDisc=this.lstAdjuntos[index].DMDAJ_NOMBRE
      }
    }
  }
  verAdjunto(adjunto: any, nombre: any) {

    if (adjunto == null || adjunto=="undefined") {
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'No se encuentra un archivo adjunto'
      })
    } else {
      var bstr = atob(adjunto),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      let file = new File([u8arr], nombre.NOMBRE, { type: 'application/pdf' });
      var url = window.URL.createObjectURL(file);
      var anchor = document.createElement("a");
      anchor.download = nombre;
      anchor.href = url;
      anchor.click();
    }


  }
  verAdjuntoCedula(){

    this.verAdjunto(this.cedula,this.nombreCedula)
  }
  verAdjuntoPapeleta(){
    this.verAdjunto(this.papeleta,this.nombrePapeleta)
  }
  verAdjuntoDisc(){
    this.verAdjunto(this.disc,this.nombreDisc)

  }
  
  aprobarInformacion(estado:any,observacion:any){
    this.inUser = localStorage.getItem('user');
    this.inUser = CryptoJS.AES.decrypt(this.inUser.toString(), 'eeasaPer').toString(CryptoJS.enc.Utf8);
    //
    let json="{\r\n" + 
    "    \"DRI_MA_APP\":{\"DMAPP_CODIGO\":\""+this.codigo+"\", \r\n" + 
    "				\"DMPER_CODIGO\":\""+this.inPer+"\",\r\n" + 
    "				\"DMAPP_ESTADO_SUBIDA\":\""+estado+"\",  \r\n" + 
    "				\"DMAPP_OBSERVACION\":\""+observacion+"\"\r\n" + 
    "	},\r\n" + 
    "    \"AUDITORIA\": {\r\n" + 
    "        \"PROYECTO\":\"SISGERH_APP\", \r\n" + 
    "				\"HOST\":\""+ this.getIp+"\",  \r\n" + 
    "				\"USUARIO\":\""+this.inUser+"\", \r\n" + 
    "				\"OPERACION\":\"UPDATE\"\r\n" + 
    "				}\r\n" + 
    "}"
    this.sisgerhService.updateDatos(json).subscribe((res:any)=>{
      if (res.MENSAJE = "El registro fue actualizado correctamente") {
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: res.MENSAJE
        })
      }
    })
  }
}
