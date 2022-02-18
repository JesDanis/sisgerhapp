import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2'
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import * as $ from "jquery";
import { TituloInt } from 'src/app/models/actualizar/titulo-int';
import { NivelInt } from 'src/app/models/actualizar/nivel-int';
import { SisgerhAdminService } from 'src/app/services/sisgerh-admin.service';

@Component({
  selector: 'app-actualizacion',
  templateUrl: './actualizacion.component.html',
  styleUrls: ['./actualizacion.component.css']
})
export class ActualizacionComponent implements OnInit {
  inUser:any
  txtAlerta:any
  actual: any
  informacion: any;
  inPer: any
  sesion: any
  imageUrl: any
  fotografia: any
  etnia: any
  discapacidad: any
  sangre: any
  nivelEdu: any
  direccion: any
  nombre: any
  contactos: any
  instruccion: any
  contactoLst: any
  descripcion: string = ""
  operadora: number = 9
  principal: number = 0
  tipo: any
  check = false;
  nivel: string = ""
  titulo: any = ""
  fecha: any = ""
  adjunto: any = ""
  codigo: any = ""
  cedula: any
  papeleta: any
  lstTitulo: any
  parroquias: any
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  txtNivel: any
  txtTitulo: any
  valueTitulo: string = ""
  nombreCedula: any
  archivoCedula: any
  nombrePapeleta: any
  archivoPapeleta: any
  certificadoDis: any
  nombrecertificadoDis: any
  archivocertificadoDis: any
  tituloAct: any
  nombreTituloAct: any
  archivotituloAct: any
  tituloN: any
  nombreTitulo: any
  archivotitulo: any
  especialidad: string = ""
  codigoTitulo: string = ""
  nombreNivel: any
  codTitulo: any
  codEstadoCivil: any
  codDiscapacidad: any
  DMDIV_CODIGO: any
  codigoAct: any
  datos: any
  lstGeneral: any
  codEtnia: any
  genero: any
  tipoSang: any
  datoDisc: any
  porcDis: any
  lstContactos: any
  callePrin: any
  calleSec: any
  referencia: any
  numCasa: any
  divPol: any
  parroquia: any
  lstDomicilio: any
  lstInstruccion: any
  nombrePadre: any
  vivePadre: any
  nombreMadre: any
  viveMadre: any
  nombreCony: any
  trabajaCony: any
  lugarCony: any
  lstAdicional: any
  lstAdjuntos: any
  cedulaAdj: any
  nombreCedulaAdj: any
  papeletaAdj: any
  nombrePapeletaAdj: any
  discAdj: any
  nombreDiscAdj: any
  getIp:any
  constructor(private datePipe: DatePipe, private sisgerhService: SisgerhMovilService, private adminService: SisgerhAdminService, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    
    this.adminService.getIPAddress().subscribe((res:any)=>{
      this.getIp=res.ip
    })
   
  $("#divAlert").hide()
    $("#divAlertInst").hide()
    $("#noCerrar").show()
    $("#cerrarModal").hide()
    $("#noCerrarInst").show()
    $("#cerrarModalInst").hide()
    this.fecha = new Date();
    fecha: ''
    this.actual = this.datePipe.transform(this.fecha, "yyyy-MM-dd");
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      info: true,
      processing: true,
      ordering: false,
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
    this.obtenerEtnia();
    this.obtenerTipoSangre();
    this.obtenerDiscapacidad();
    this.obtenerNivelEducativo();
    this.obtenerParroquias();
    this.inPer = localStorage.getItem('codPer');
    this.inPer = CryptoJS.AES.decrypt(this.inPer.toString(), 'eeasaPer').toString(CryptoJS.enc.Utf8);
    this.adminService.obtenerActualizacion(btoa(this.inPer)).subscribe((res: any) => {
      if (res.length == 1) {
        this.codigoAct = (res[0].DMAPP_CODIGO)
        this.obtenerContenido(res[0].DMAPP_CONTENIDO)
      } else {
        this.codigoAct = ''
        this.obtenerInformacion()
      }
    })
  }
  obtenerContenido(contenido: any) {
    this.lstGeneral = ['']
    this.lstContactos = ['']
    this.lstDomicilio = ['']
    this.datos = JSON.parse(contenido + '}');
    this.lstGeneral = this.datos["GENERAL"]
    this.codEstadoCivil = this.lstGeneral.DMPER_ESTADO_CIVIL
    this.codEtnia = this.lstGeneral.DMETI_CODIGO
    this.genero = this.lstGeneral.DMPER_GENERO
    this.tipoSang = this.lstGeneral.DMGTS_CODIGO
    this.codDiscapacidad = this.lstGeneral.DMDSC_CODIGO
    this.datoDisc = this.lstGeneral.DMDSC_CODIGO
    this.porcDis = this.lstGeneral.DMGDS_PORCENTAJE
    this.lstContactos = this.datos["CONTACTO"]
    this.obtenerContacto()
    this.lstDomicilio = this.datos["DOMICILIARIA"]
    this.callePrin = this.lstDomicilio.DMDRC_CALLE_PRINCIPAL
    this.calleSec = this.lstDomicilio.DMDRC_CALLE_SEGUNDA
    this.numCasa = this.lstDomicilio.DMDRC_NUMERO_CASA
    this.referencia = this.lstDomicilio.DMDRC_REFERENCIA
    this.DMDIV_CODIGO = this.lstDomicilio.DMDIV_CODIGO
    this.adminService.obtenerDivision(this.lstDomicilio.DMDIV_CODIGO).subscribe((res: any) => {
      this.divPol = res[0].DIVISION
      this.parroquia = res[0].PARROQUIA
    })
    this.lstContactos = this.datos["CONTACTO"]
    this.lstInstruccion = this.datos["ACADEMICA"]
    this.lstAdicional = this.datos["ADICIONAL"]
    this.lstAdjuntos = this.datos["ADJUNTOS"]
    this.nombrePadre = this.lstAdicional.DMPER_NOMBRE_PADRE
    this.nombreMadre = this.lstAdicional.DMPER_NOMBRE_MADRE
    this.nombreCony = this.lstAdicional.DMPER_NOMBRE_CNY
    this.vivePadre = this.lstAdicional.DMPER_PADRE_VIVE
    this.viveMadre = this.lstAdicional.DMPER_MADRE_VIVE
    this.trabajaCony = this.lstAdicional.DMPER_TRAB_CONYUGUE
    this.obtenerInstruccion()

    if (this.trabajaCony == "1" || this.trabajaCony == 1) {
      this.lugarCony = this.lstAdicional.DMPER_LUGAR_TRAB_CNY
      this.trabajaSi()
    } else {
      this.lugarCony = ""
      this.trabajaNo()
    }
    if (this.codEstadoCivil == 1 || this.codEstadoCivil == 3) {
      $("#divEstadoCivil").show()
    } else {
      $("#divEstadoCivil").hide()
      $("#divInstitucion").hide()
    }

    if (this.codDiscapacidad != ' ') {
      $("#divDiscapacidad").show()
    } else {
      $("#divDiscapacidad").hide()
    }
    this.obtenerAdjuntos()
  }
  obtenerInformacion() {
    this.informacion = [''];
    this.sisgerhService.obternerInformacionPer(btoa(this.inPer)).subscribe(res => {
  
      this.informacion = res;
      this.informacion = this.informacion[0];
      this.codEstadoCivil = this.informacion.DMPER_ESTADO_CIVIL
      this.codEtnia = this.informacion.DMETI_CODIGO
      this.genero = this.informacion.DMPER_GENERO
      this.tipoSang = this.informacion.CODIGO_SANGRE
      this.codDiscapacidad = this.informacion.DISCAPACIDAD
      this.datoDisc = this.informacion.CODIGO_DISCAPACIDAD
      this.porcDis = this.informacion.PORCENTAJE
      this.nombrePadre = this.informacion.NOMBRE_PADRE
      this.nombreMadre = this.informacion.NOMBRE_MADRE
      this.nombreCony = this.informacion.NOMBRE_CONYUGUE
      this.vivePadre = this.informacion.DMPER_PADRE_VIVE
      this.viveMadre = this.informacion.DMPER_MADRE_VIVE
      this.trabajaCony = this.informacion.DMPER_TRAB_CONYUGUE
      this.nombreCedulaAdj = " "
      this.nombrePapeletaAdj = " "
      this.nombreDiscAdj = " "
      if (this.trabajaCony == "1" || this.trabajaCony == 1) {
        this.lugarCony = this.informacion.DMPER_LUGAR_TRAB_CNY
        this.trabajaSi()
      } else {
        this.lugarCony = ""
        this.trabajaNo()
      }
      if (this.codEstadoCivil == "1" || this.codEstadoCivil == "3") {
        $("#divEstadoCivil").show()
      } else {
        $("#divEstadoCivil").hide()
        $("#divInstitucion").hide()
      }
  
      if (this.codDiscapacidad != ' ') {
        $("#divDiscapacidad").show()
      } else {
        $("#divDiscapacidad").hide()
      }
    });
    this.contactos = ['']
    this.sisgerhService.obtenerContactos(btoa(this.inPer)).subscribe(res => {
      this.contactos = res
    })

    this.direccion = ['']
    this.sisgerhService.obtenerDireccion(btoa(this.inPer)).subscribe(res => {
      this.direccion = res
      this.direccion = this.direccion[0]
      this.callePrin = this.direccion.CALLE_PRINCIPAL
      this.calleSec = this.direccion.CALLE_SECUNDARIA
      this.numCasa = this.direccion.NUM_CASA
      this.referencia = this.direccion.REFERENCIA
      this.divPol = this.direccion.DIVISION
      this.parroquia = this.direccion.PARROQUIA
      this.DMDIV_CODIGO = this.direccion.DMDIV_CODIGO
    })
    this.instruccion = ['']
    this.sisgerhService.obternerInstruccion(btoa(this.inPer)).subscribe(res => {
      this.instruccion = res
    });
    
  }

  obtenerContacto() {
    this.contactos = []
    let v = this.lstContactos
    let op = ""
    for (let index = 0; index < v.length; index++) {
      this.adminService.obtenerContacto(v[index].DTCON_CODIGO).subscribe((res: any) => {
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
        this.contactos.push({ "DTCON_CODIGO": v[index].DTCON_CODIGO, "DTCON_DESCRIPCION": res[0].DTCON_DESCRIPCION, "DPCNT_DESCRIPCION": v[index].DPCNT_DESCRIPCION, "DPCNT_OPERADORA_DET": op, "DPCNT_OPERADORA":v[index].DPCNT_OPERADORA,"DPCNT_PRINCIPAL": v[index].DPCNT_PRINCIPAL })
      })
    }

  }
  obtenerInstruccion() {
    this.instruccion = []
    let v = this.lstInstruccion
    let nombre
    let adjunto
    for (let index = 0; index < v.length; index++) {
      this.adminService.obtenerInstruccion(v[index].DMNED_CODIGO, v[index].DSLTT_CODIGO).subscribe((res: any) => {

        if (v[index].DSLPT_NOMBRE_ADJ == "undefined" ||v[index].DSLPT_NOMBRE_ADJ == "null" ) {
          nombre = " "
        } else {
          nombre = v[index].DSLPT_NOMBRE_ADJ
        }
        this.instruccion.push({ "DMNED_CODIGO": v[index].DMNED_CODIGO, "DSLTT_CODIGO": v[index].DSLTT_CODIGO, "DMNED_DESCRIPCION": res[0].DMNED_DESCRIPCION, "NIVEL": res[0].DMNED_DESCRIPCION, "TITULO": res[0].TITULO, "ESPECIALIDAD": v[index].DSLTT_ESPECIALIDAD, "FECHA": v[index].DSLTT_FECHA, "ADJUNTO": v[index].DSLPT_ADJUNTO, "DSLPT_ADJUNTO": v[index].DSLPT_ADJUNTO, "NOMBRE": nombre })
      })
    }

  }
  obtenerAdjuntos() {
    let v = this.lstAdjuntos
    for (let index = 0; index < v.length; index++) {
      if (v[index].DCFTD_CODIGO == "DCFTD3") {
        this.cedulaAdj = this.lstAdjuntos[index].DMDAJ_DOCUMENTO

        this.nombreCedulaAdj = this.lstAdjuntos[index].DMDAJ_NOMBRE
        if (this.nombreCedulaAdj == "undefined") {
          this.nombreCedulaAdj = " "
        } else {
          this.nombreCedulaAdj = this.lstAdjuntos[index].DMDAJ_NOMBRE
        }

      }
      if (v[index].DCFTD_CODIGO == "DCFTD13") {
        this.papeletaAdj = this.lstAdjuntos[index].DMDAJ_DOCUMENTO
        this.nombrePapeletaAdj = this.lstAdjuntos[index].DMDAJ_NOMBRE
        if (this.nombrePapeletaAdj == "undefined") {
          this.nombrePapeletaAdj = " "
        } else {
          this.nombrePapeletaAdj = this.lstAdjuntos[index].DMDAJ_NOMBRE
        }
      }
      if (v[index].DCFTD_CODIGO == "DCFTD7") {
        this.discAdj = this.lstAdjuntos[index].DMDAJ_DOCUMENTO
        this.nombreDiscAdj = this.lstAdjuntos[index].DMDAJ_NOMBRE
        if (this.nombreDiscAdj == "undefined") {
          this.nombreDiscAdj = " "
        } else {
          this.nombreDiscAdj = this.lstAdjuntos[index].DMDAJ_NOMBRE
        }
      }
    }
  }
  obtenerEtnia() {
    this.etnia = ['']
    this.sisgerhService.obtenerEtnia().subscribe(res => {
      this.etnia = res
    })
  }
  obtenerTipoSangre() {
    this.sangre = ['']
    this.sisgerhService.obtenerTipoSanguineo().subscribe(res => {
      this.sangre = res
    })
  }
  obtenerDiscapacidad() {
    this.discapacidad = ['']
    this.sisgerhService.obtenerDiscapacidad().subscribe(res => {
      this.discapacidad = res
    })
  }
  obtenerNivelEducativo() {
    this.nivelEdu = ['']
    this.sisgerhService.obtenerNivelEducativo().subscribe(res => {
      this.nivelEdu = res
    })
  }

  obtenerParroquias() {
    this.parroquias = ['']
    this.sisgerhService.obtenerParroquias().subscribe(res => {
      this.parroquias = res
      this.dtTrigger.next();
    })
  }

  addContacto() {
    this.descripcion = ''
    this.tipo = 9
    this.principal = 0
    this.operadora = 9

    let op = "9"
    let con = "9"
    this.tipo = $("#contacto").val();
    if(this.tipo==9){
    $("#divAlert").show()
    this.txtAlerta="Debe seleccionar un tipo de contacto"
    $("#divAlert").fadeTo(2000, 500).slideUp(400, function(){
      $("divAlert").slideUp(500);
  });
    }else{
      if (this.tipo == 'DTCON2') {
        con = "CELULAR"
      } else if (this.tipo == 'DTCON1') {
        con = "TELEFONO"
      } else if (this.tipo == 'DTCON5') {
        con = "EMAIL PERSONAL"
      }
      this.descripcion = String($("#mdlDescripcion").val())
    this.operadora = Number($("#slcOperadora").val());
    if(this.operadora==9){
      $("#divAlert").show()
      this.txtAlerta="Debe seleccionar un tipo de operadora"
      $("#divAlert").fadeTo(2000, 500).slideUp(400, function(){
        $("divAlert").slideUp(500);
    });
    }else{
      if(this.descripcion==""){
        $("#divAlert").show()
        this.txtAlerta="Debe ingresar una descripción"
        $("#divAlert").fadeTo(2000, 500).slideUp(400, function(){
          $("divAlert").slideUp(500);
      });
      }else{
        if (this.operadora == 1) {
          op = "CNT"
        } else if (this.operadora == 2) {
          op = "MOVISTAR"
        } else if (this.operadora == 3) {
          op = "CLARO"
        } else if (this.operadora == 4) {
          op = "OTROS"
        } else if (this.operadora == 5) {
          op = "FIJO"
        } else if (this.operadora == 0) {
          op = ""
        }
        if (this.check == true) {
          this.principal = 1
        } else {
          this.principal = 0
        }
        this.contactos.push({ "DPCNT_CODIGO": "", "DPCNT_DESCRIPCION": this.descripcion, "DPCNT_OPERADORA": this.operadora, "DPCNT_OPERADORA_DET": op, "DPCNT_PRINCIPAL": this.principal, "DTCON_CODIGO": this.tipo, "DTCON_DESCRIPCION": con })
      }
    }
    }    
     }
close(){
  if(this.operadora==9){
    $("#noCerrar").hide()
    $("#cerrarModal").show()

  }else{
    $("#cerrarModal").show()
    $("#noCerrar").hide()

  }
}

  limpiarDatos() {
    this.contactoLst = ['']
    this.descripcion = ''
    this.tipo = 9
    this.principal = 0
    this.operadora = 9
  }

  confirmarBorrar(dato: any) {
    Swal.fire({
      title: 'Alerta',
      text: "Esta seguro de borrar el contacto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.contactos.findIndex(function (el: any) {
          return el.DPCNT_CODIGO == dato;
        });
        this.contactos.splice(index, 1);
      }
    })
  }
  confirmarBorrarInst(dato: any) {
    Swal.fire({
      title: 'Alerta',
      text: "Esta seguro de borrar la información",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.instruccion.findIndex(function (el: any) {
          return el.DSLPT_CODIGO == dato;
        });

        this.instruccion.splice(index, 1);
      }
    })
  }
  descargar(codigo: string) {
    this.sisgerhService.obtenerAdjuntoInstruccion(codigo).subscribe((response: any) => {
      if (response[0].ADJUNTO == null) {
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'No se encuentra un adjunto, actualizar el archivo'
        })
      } else {
        var bstr = atob(response[0].ADJUNTO),
          n = bstr.length,
          u8arr = new Uint8Array(n);

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        let file = new File([u8arr], response[0].NOMBRE, { type: 'application/pdf' });
        var url = window.URL.createObjectURL(file);
        var anchor = document.createElement("a");
        anchor.download = response[0].NOMBRE;
        anchor.href = url;
        anchor.click();
      }

    })
  }
  // informacionIntruccion(codigo: string) {
  //   this.codigo = codigo
  //   this.sisgerhService.informacionInstruccion(codigo).subscribe((response: any) => {
  //     this.nombreNivel = response[0].NIVEL
  //     this.nivel = response[0].CODIGO
  //     this.titulo = response[0].TITULO
  //     this.codTitulo = response[0].COD_TIT
  //     var fecha = moment(response[0].FECHA, 'DD-MM-YYYY');
  //     this.fecha = fecha.format('YYYY-MM-DD');
  //     this.adjunto = response[0].NOMBRE
  //     this.especialidad = response[0].ESPECIALIDAD
  //   })
  // }
  informacionIntruccion(nivel:string,codNivel:string, titulo:string,codTitulo:any,especialidad:string,fechaT:string, adjunto:string) {
     this.nombreNivel = nivel
      this.nivel = codNivel
      this.titulo = titulo
      this.codTitulo = codTitulo
      var fecha = moment(fechaT, 'DD-MM-YYYY');
      this.fecha = fecha.format('YYYY-MM-DD');
      this.adjunto = adjunto
      this.especialidad = especialidad
    
  }
  actualizarInst() {
    let cod = this.codTitulo
    let index = this.instruccion.findIndex(function (el: any) {
      return el.DSLTT_CODIGO == cod;
    });
    this.instruccion.splice(index, 1);
    let fecha: string | any = $("#fechaTitulo").val();
    let fechaT = this.datePipe.transform(fecha, "dd/MM/yyyy");
    this.instruccion.push({ "DMNED_CODIGO": this.nivel, "DSLPT_ADJUNTO": this.archivotituloAct, "DSLPT_CODIGO": "", "DSLTT_CODIGO": this.codTitulo, "ESPECIALIDAD": this.especialidad, "FECHA": fechaT, "NIVEL": this.nombreNivel, "NOMBRE": this.nombreTituloAct, "TITULO": this.titulo })
  }
  actualizarTitulo(event: any) {
    console.log(this.adjunto)
    let data = event.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = () => {
      this.archivotituloAct = reader.result
      //data:application/pdf;base64,
      this.archivotituloAct = this.archivotituloAct.slice(28);
    };
    this.tituloAct = data
    this.nombreTituloAct = this.tituloAct.name
    this.adjunto = this.nombreTituloAct
  }
  nuevoTitulo(event: any) {
    let data = event.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = () => {
      this.archivotitulo = reader.result
      this.archivotitulo = this.archivotitulo.slice(28);
    };
    this.tituloN = data
    this.nombreTitulo = this.tituloN.name
    this.adjunto = this.nombreTitulo
  }
  obtenerCedula(event: any) {
    let data = event.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = () => {
      this.archivoCedula = reader.result
      this.archivoCedula = this.archivoCedula.slice(28);
    };
    this.cedula = data
    this.nombreCedula = this.cedula.name
    this.nombreCedulaAdj = " "
  }
  obtenerPapeleta(event: any) {
    let data = event.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = () => {
      this.archivoPapeleta = reader.result
      this.archivoPapeleta = this.archivoPapeleta.slice(28);
    }
    this.papeleta = data
    this.nombrePapeleta = this.papeleta.name
    this.nombrePapeletaAdj = " "

  }
  obtenerCertificadoDis(event: any) {
    let data = event.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = () => {
      this.archivocertificadoDis = reader.result
      this.archivocertificadoDis = this.archivocertificadoDis.slice(28);
    }
    this.certificadoDis = data
    this.nombrecertificadoDis = this.certificadoDis.name
    this.nombreDiscAdj = " "

  }
  obtenerTitulos(dato: any) {
    dato = $("#nvlEdu2").val()
    this.lstTitulo = ['']
    this.sisgerhService.obtenerTitulos(dato).subscribe(res => {
      this.lstTitulo = res
    })
  }
  visualizarCedula() {
    if ((this.nombreCedulaAdj == "undefined" || this.cedulaAdj == "undefined") && this.cedula=="") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha cargado el archivo'
      })
    } else {
      this.adminService.obtenerActualizacion(btoa(this.inPer)).subscribe((res: any) => {
        if (res.length == 1 && this.nombreCedulaAdj != " ") {
          this.verAdjunto(this.cedulaAdj, this.nombreCedulaAdj)
        } else {
          if (this.cedula == undefined) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se ha cargado el archivo'
            })
          } else {
            var url = window.URL.createObjectURL(this.cedula)
            var anchor = document.createElement("a");
            anchor.download = this.nombreCedula;
            anchor.href = url;
            anchor.click();
          }

        }


      })

    }
  }
  visualizarPapeleta() {
    if ((this.nombrePapeletaAdj == "undefined" || this.papeletaAdj == "undefined" ) && this.papeleta =="") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha cargado el archivo'
      })
    } else {
      this.adminService.obtenerActualizacion(this.inPer).subscribe((res: any) => {
        if (res.length == 1 && this.nombrePapeletaAdj != " ") {
          this.verAdjunto(this.papeletaAdj, this.nombrePapeletaAdj)
        } else {
          if (this.papeleta == undefined) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se ha cargado el archivo'
            })
          } else {
            var url = window.URL.createObjectURL(this.papeleta)
            var anchor = document.createElement("a");
            anchor.download = this.nombrePapeleta;
            anchor.href = url;
            anchor.click();
          }

        }


      })

    }


  }
  visualizarCertificado() {

    if ((this.nombreDiscAdj == "undefined" || this.discAdj == "undefined") && this.certificadoDis=="") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha cargado el archivo'
      })
    } else {
      this.adminService.obtenerActualizacion(btoa(this.inPer)).subscribe((res: any) => {
        if (res.length == 1 && this.nombreDiscAdj != " ") {
          this.verAdjunto(this.discAdj, this.nombreDiscAdj)
        } else {
          if (this.certificadoDis == undefined) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se ha cargado el archivo'
            })
          } else {
            var url = window.URL.createObjectURL(this.certificadoDis)
            var anchor = document.createElement("a");
            anchor.download = this.nombrecertificadoDis;
            anchor.href = url;
            anchor.click();
          }
        }
      })
    }
  }
  discapacidadSi() {
    $("#divDiscapacidad").show()
  }
  discapacidadNo() {
    $("#divDiscapacidad").hide()
  }
  trabajaSi() {
    $("#divInstitucion").show()

  }
  trabajaNo() {
    $("#divInstitucion").hide()

  }
  estadoCivil() {

    let estado = $("#estCivil").val()
    if (estado == 1 || estado == 3) {
      $("#divEstadoCivil").show()
    } else {
      $("#divEstadoCivil").hide()
    }
  }

  seleccionarParroquia(value: any, div: any) {
   // this.direccion.PARROQUIA = value
    this.parroquia=value
    this.DMDIV_CODIGO = div
  }
  obtenerDato(value: any) {

    let valor: TituloInt = this.lstTitulo.find((s: any) => s.DSLTT_CODIGO == value)
    if (valor)
      this.valueTitulo = valor.DSLTT_DESCRIPCION
    this.titulo = valor.DSLTT_DESCRIPCION
    this.valueTitulo = valor.DSLTT_DESCRIPCION
    this.especialidad = valor.DSLTT_ESPECIALIDAD
    this.codigoTitulo = valor.DSLTT_CODIGO
  }
  limpiarCamposTit() {
    this.lstTitulo = ['']
    this.txtTitulo=""
    this.txtNivel=""
    this.valueTitulo=""
    this.especialidad=""
    //$("#fechaTitulo2").val()
  }
  addTitulo() {
    let DMNED_CODIGO = $("#nvlEdu2").val()
    if(DMNED_CODIGO==null){
      $("#divAlertInst").show()
      this.txtAlerta="Debe seleccionar un nivel de instrucción"
      $("#divAlertInst").fadeTo(2000, 500).slideUp(400, function(){
        $("divAlertInst").slideUp(500);
    });
    }else{
    if(this.txtTitulo==undefined){
      $("#divAlertInst").show()
      this.txtAlerta="Debe seleccionar un titulo"
      $("#divAlertInst").fadeTo(2000, 500).slideUp(400, function(){
        $("divAlertInst").slideUp(500);
    });
    }else{
      let fecha=$("#fechaTitulo2").val()
      if(fecha==""){
        $("#divAlertInst").show()
        this.txtAlerta="Debe seleccionar una fecha válida"
        $("#divAlertInst").fadeTo(2000, 500).slideUp(400, function(){
          $("divAlertInst").slideUp(500);
      });
        
      }else{
        $("#cerrarModalInst").show()
       
          $("#noCerrarInst").hide()
    let valor: NivelInt = this.nivelEdu.find((s: any) => s.DMNED_CODIGO == DMNED_CODIGO)
    let nivel
    if (valor)
      nivel = valor.DMNED_DESCRIPCION
    let especialidad = $("#txtEspecialidad2").val()
    let fecha: string | any = $("#fechaTitulo2").val();
    let fechaT = this.datePipe.transform(fecha, "dd/MM/yyyy");
   this.instruccion.push({ "DMNED_CODIGO": DMNED_CODIGO, "DSLPT_ADJUNTO": this.archivotitulo, "DSLPT_CODIGO": "", "DSLTT_CODIGO": this.codigoTitulo, "ESPECIALIDAD": especialidad, "FECHA": fechaT, "NIVEL": nivel, "NOMBRE": this.nombreTitulo, "TITULO": this.titulo })
 
      }
    }
    

    }
    
     }
     
  cambioFecha(){
    let fecha=$("#fechaTitulo2").val()
    if(fecha!=""){
      $("#cerrarModalInst").show()
       
      $("#noCerrarInst").hide()
    }else{
      $("#cerrarModalInst").hide()
       
      $("#noCerrarInst").show()
    }
  }
     
  verAdjunto(adjunto: any, nombre: any) {

    if (adjunto == null || adjunto == "undefined") {
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

  actualizar(){
    let discapacidad = $('input[name="disc"]:checked').val();
    if(discapacidad=="discSi" ||this.codDiscapacidad!=' '){
      let val=$("#txtPorcentaje").val()
       if(val=="0" || val=="" || val==" " ){
         $("#txtPorcentaje").focus();
         Swal.fire({
           icon: 'error',
           title: 'Error',
           text: 'No se ha ingresado un porcentaje de discapacidad'
         })
       }
    }else{
      let referencia=$("#referencia").val()
      if(referencia=="" || referencia== " "){
        $("#referencia").focus();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se ha ingresado una referencia domiciliaria'
        })
      }else{
        let calleP=$("#callePrincipal").val()
        if(calleP=="" || calleP== " "){
          $("#callePrincipal").focus();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se ha ingresado una calle principal'
          })
        }else{
          let calleS=$("#calleSegunda").val()
          if(calleS=="" || calleS== " "){
            $("#callePrincipal").focus();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se ha ingresado una calle secundaria'
            })
          }else{
            this.actualizarInformacion()
          }
        }
      }
    }
    
    
    
    
  }
  actualizarInformacion() {
    //GENERAL
    let DMPER_ESTADO_CIVIL = $("#estCivil").val()

    let discapacidad = $('input[name="disc"]:checked').val();
    let DMDSC_CODIGO
    let DMGDS_PORCENTAJE
    let jsonDis
    if (discapacidad == 'discNo') {
      DMDSC_CODIGO = ' '
      DMGDS_PORCENTAJE = 0
    } else {
      DMDSC_CODIGO = $("#sltDiscapacidad").val()
      DMGDS_PORCENTAJE = $("#txtPorcentaje").val()
      let nombreDis
      let adjuntoDis
      if(this.nombrePapeletaAdj==" "){
        nombreDis=this.nombrecertificadoDis
      adjuntoDis=this.archivocertificadoDis
      }else{
        nombreDis=this.nombrePapeletaAdj
        adjuntoDis=this.discAdj
      }
      jsonDis = ",{\r\n" +
        "	  	\"DMDAJ_CODIGO\":\"\",\r\n" +
        "	  	\"DCFTD_CODIGO\":\"DCFTD7\",\r\n" +
        "	  	\"DMDAJ_DOCUMENTO\":\"" + adjuntoDis + "\",\r\n" +
        "	  	\"DMDAJ_NOMBRE\":\"" + nombreDis + "\",\r\n" +
        "	  	\"DMDAJ_TIPO_CONT_ADJ\": \"application/pdf\"\r\n" +
        "	  	}],"
    }
    //JSON

    let jsonGeneral = "{\r\n" +
      "    \"GENERAL\":{\r\n" +
      "	  	\"DMPER_CODIGO\":\"" + this.inPer + "\",\r\n" +
      "	  	\"DMPER_ESTADO_CIVIL\":\"" + DMPER_ESTADO_CIVIL + "\",\r\n" +
      "	  	\"DMETI_CODIGO\":\"" + $("#sltEtnina").val() + "\",\r\n" +
      "	  	\"DMPER_GENERO\":\"" + $("#sltSexo").val() + "\",\r\n" +
      "	  	\"DMGTS_CODIGO\": \"" + $("#tipoSang").val() + "\",\r\n" +
      "	  	\"DMDSC_CODIGO\":\"" + DMDSC_CODIGO + "\",\r\n" +
      "	  	\"DMGDS_PORCENTAJE\": \"" + DMGDS_PORCENTAJE + "\"\r\n" +
      "	  	},"
    //ADJUNTOS
    let adjuntoCedula
    let nombreCedula
    let adjuntoPapeleta
    let nombrePapeleta
    if(this.nombreCedulaAdj==" "){
      adjuntoCedula= this.archivoCedula
      nombreCedula=this.nombreCedula
    }else{
      adjuntoCedula=this.cedulaAdj
      nombreCedula=this.nombreCedulaAdj
    }
    if(this.nombrePapeletaAdj==" "){
      adjuntoPapeleta=this.archivoPapeleta
      nombrePapeleta=this.nombrePapeleta
    }else{
      adjuntoPapeleta=this.papeletaAdj
      nombrePapeleta=this.nombrePapeletaAdj
    }
    let jsonAdjuntos1 =
      "    \"ADJUNTOS\":[{\r\n" +
      "	  	\"DMDAJ_CODIGO\":\"\",\r\n" +
      "	  	\"DCFTD_CODIGO\":\"DCFTD3\",\r\n" +
      "	  	\"DMDAJ_DOCUMENTO\":\"" +adjuntoCedula + "\",\r\n" +
      "	  	\"DMDAJ_NOMBRE\":\"" + nombreCedula + "\",\r\n" +
      "	  	\"DMDAJ_TIPO_CONT_ADJ\": \"application/pdf\"\r\n" +
      "	  	}," +
      "{\r\n" +
      "	  	\"DMDAJ_CODIGO\":\"\",\r\n" +
      "	  	\"DCFTD_CODIGO\":\"DCFTD13\",\r\n" +
      "	  	\"DMDAJ_DOCUMENTO\":\"" + adjuntoPapeleta + "\",\r\n" +
      "	  	\"DMDAJ_NOMBRE\":\"" + nombrePapeleta + "\",\r\n" +
      "	  	\"DMDAJ_TIPO_CONT_ADJ\": \"application/pdf\"\r\n" +
      "	  	}"

    let jsonAdjuntos2
    if (discapacidad == 'discNo') {
      jsonAdjuntos2 = "],"
    } else {
      jsonAdjuntos2 = jsonDis
    }
    let jsonAdjuntos = jsonAdjuntos1 + jsonAdjuntos2
    //CONTACTO
    let detalleContacto = []
    for (let i = 0; i < this.contactos.length; i++) {
      detalleContacto.push("{	\"DPCNT_CODIGO\":\"\",\r\n" +
        "	  		\"DTCON_CODIGO\":\"" + this.contactos[i].DTCON_CODIGO + "\",\r\n" +
        "	  		\"DPCNT_DESCRIPCION\":\"" + this.contactos[i].DPCNT_DESCRIPCION + "\",\r\n" +
        "	  		\"DPCNT_OPERADORA\":\"" + this.contactos[i].DPCNT_OPERADORA + "\",\r\n" +
        "	  		\"DPCNT_PRINCIPAL\":\"" + this.contactos[i].DPCNT_PRINCIPAL + "\"\r\n" +
        "	  	}")
    }
    let jsonContacto = "\"CONTACTO\":[" + detalleContacto + "],"
    //DOMICILIARIA
    let jsonDomicilio =
      "    \"DOMICILIARIA\":{\r\n" +
      "	  	\"DMDRC_CODIGO\":\"\",\r\n" +
      "	  	\"DMDIV_CODIGO\":\"" + this.DMDIV_CODIGO + "\",\r\n" +
      "	  	\"DMDRC_CALLE_PRINCIPAL\":\"" + $("#callePrincipal").val() + "\",\r\n" +
      "	  	\"DMDRC_CALLE_SEGUNDA\":\"" + $("#calleSegunda").val() + "\",\r\n" +
      "	  	\"DMDRC_NUMERO_CASA\": \"" + $("#numCasa").val() + "\",\r\n" +
      "	  	\"DMDRC_REFERENCIA\":\"" + $("#referencia").val() + "\"\r\n" +
      "	  	},"
    //ACADEMICA
    let detalleInstruccion = []
    for (let i = 0; i < this.instruccion.length; i++) {
      detalleInstruccion.push("{	\"DSLPT_CODIGO\":\"\",\r\n" +
        "	  		\"DMNED_CODIGO\":\"" + this.instruccion[i].DMNED_CODIGO + "\",\r\n" +
        "	  		\"DSLTT_CODIGO\":\"" + this.instruccion[i].DSLTT_CODIGO + "\",\r\n" +
        "	  		\"DSLTT_ESPECIALIDAD\":\"" + this.instruccion[i].ESPECIALIDAD + "\",\r\n" +
        "	  		\"DSLTT_FECHA\":\"" + this.instruccion[i].FECHA + "\",\r\n" +
        "	  		\"DSLPT_ADJUNTO\":\"" + this.instruccion[i].DSLPT_ADJUNTO + "\",\r\n" +
        "	  		\"DSLPT_NOMBRE_ADJ\":\"" + this.instruccion[i].NOMBRE + "\",\r\n" +
        "	  		\"DSLPT_TIPO_CONT_ADJ\":\"application/pdf\"\r\n" +
        "	  	}")
    }
    let jsonAcademica = "\"ACADEMICA\":[" + detalleInstruccion + "],"
    //ADICIONAL
    let DMPER_PADRE_VIVE
    let DMPER_MADRE_VIVE
    let padre = $('input[name="padre"]:checked').val();
    if (padre == 'siP') {
      DMPER_PADRE_VIVE = 1
    } else {
      DMPER_PADRE_VIVE = 0
    }
    let madre = $('input[name="madre"]:checked').val();
    if (madre == 'siM') {
      DMPER_MADRE_VIVE = 1
    } else {
      DMPER_MADRE_VIVE = 0
    }
    let DMPER_TRAB_CONYUGUE
    let DMPER_LUGAR_TRAB_CNY
    let DMPER_NOMBRE_CNY
    if (DMPER_ESTADO_CIVIL == 1 || DMPER_ESTADO_CIVIL == 3) {
      DMPER_NOMBRE_CNY = $("#nombreCony").val()
      DMPER_TRAB_CONYUGUE = 1,
        DMPER_LUGAR_TRAB_CNY = $("#trabajoCony").val()
    } else {
      DMPER_NOMBRE_CNY = ""
      DMPER_TRAB_CONYUGUE = 0,
        DMPER_LUGAR_TRAB_CNY = ""
    }
    let jsonAdicional =
      "    \"ADICIONAL\":{\r\n" +
      "	  	\"DMPER_NOMBRE_PADRE\":\"" + $("#nombrePadre").val() + "\",\r\n" +
      "	  	\"DMPER_NOMBRE_MADRE\":\"" + $("#nombreMadre").val() + "\",\r\n" +
      "	  	\"DMPER_PADRE_VIVE\":\"" + DMPER_PADRE_VIVE + "\",\r\n" +
      "	  	\"DMPER_MADRE_VIVE\":\"" + DMPER_MADRE_VIVE + "\",\r\n" +
      "	  	\"DMPER_NOMBRE_CNY\": \"" + DMPER_NOMBRE_CNY + "\",\r\n" +
      "	  	\"DMPER_TRAB_CONYUGUE\":\"" + DMPER_TRAB_CONYUGUE + "\",\r\n" +
      "	  	\"DMPER_LUGAR_TRAB_CNY\": \"" + DMPER_LUGAR_TRAB_CNY + "\"\r\n" +
      "	  	}"

    let jsonDri_ma_app = "{\"DRI_MA_APP\":{\r\n" +
      "\"DMAPP_CODIGO\":\"" + this.codigoAct + "\",\r\n" +
      "\"DMPER_CODIGO\":\"" + this.inPer + "\",\r\n" +
      "\"DMAPP_ESTADO_SUBIDA\":\"P\",\r\n" +
      "\"DMAPP_OBSERVACION\":\"INFORMACION MODIFICADA DESDE SISGERH APP\",\r\n" +
      "\"CONTENIDO\":\""
      this.inUser = localStorage.getItem('user');
      this.inUser = CryptoJS.AES.decrypt(this.inUser.toString(), 'eeasaPer').toString(CryptoJS.enc.Utf8);
    let jsonContenido = btoa(jsonGeneral + jsonAdjuntos + jsonContacto + jsonDomicilio + jsonAcademica + jsonAdicional) + "\"\r\n" +
      "}, \r\n" +
      "\"AUDITORIA\": {\"PROYECTO\":\"SISGERH_APP\",\r\n" +
      "\"HOST\":\""+ this.getIp+"\", \r\n" +
      "\"USUARIO\":\""+this.inUser+"\",\r\n" +
      "\"OPERACION\":\"INSERT\"}\r\n" +
      "}"



    let json = jsonDri_ma_app + jsonContenido
    this.sisgerhService.insertDatos(json).subscribe((res: any) => {
      //MENSAJE: ''
      if (res.MENSAJE = "El registro fue guardado correctamente") {
        // Swal.fire({
        //   icon: 'info',
        //   title: 'Información',
        //   text: res.MENSAJE
        // })
        Swal.fire({
          title: 'Información',
          text: res.MENSAJE,
          icon: 'info',
          showCancelButton: false,
          confirmButtonColor: '#7066e0',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        })
      }
      else{
        Swal.fire({
          icon: 'warning',
          title: 'No se ha podido actualizar la información, contáctese con el Administrador',
          text: res.MENSAJE
        })
      }
    })
  }
 
}
