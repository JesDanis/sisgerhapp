import { Component, OnInit } from '@angular/core';
import {DatePipe} from '@angular/common';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'
import {AdministracionService} from 'src/app/guards/administracion.service'

import { PdfMakeWrapper,Img, Table, Ul, Line } from 'pdfmake-wrapper';
//import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as pdfFonts from "pdfmake/build/vfs_fonts"
import { Txt, Columns} from 'pdfmake-wrapper';
PdfMakeWrapper.setFonts(pdfFonts);


@Component({
  selector: 'app-consolidado',
  templateUrl: './consolidado.component.html',
  styleUrls: ['./consolidado.component.css']
})

export class ConsolidadoComponent implements OnInit {

inDesde:any
inDesdeR:any
inHasta:any
inPer:any
actual:any
consolidado:any
fecha!:Date
inEstado:any
dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject<any>();
page:any=0 

  constructor(private datePipe: DatePipe,
    private sisgerhService:SisgerhMovilService,
     private authService:AdministracionService
     ) {   }

  ngOnInit(): void {
    $("#btnImprimir").hide()
    $("#divSpin").hide()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
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
        },
        {
          targets: [2, 3, 4],
          className: 'dt-body-left',
        }
      ]
    };
    this.fecha = new Date();
    fecha : ''  
    
    this.actual =this.datePipe.transform(this.fecha,"yyyy-MM-dd");
    let tmpFecha=new Date();
    this.inDesde =this.datePipe.transform((tmpFecha.getFullYear()+"-"+(tmpFecha.getMonth() +1) +"-"+ 1),'yyyy-MM-dd');
  }

obtenerConsolidado():void{
  $("#divSpin").show()
  let Desde: string|any = $("#fechaInicio").val();
  let Hasta: string|any = $("#fechaFin").val();
  this.inDesdeR=this.datePipe.transform(Desde,"yyyy-MM-dd");
  this.inHasta=this.datePipe.transform(Hasta,"yyyy-MM-dd");
  this.inEstado=Number($("#estado").val())
  if (this.inHasta>this.actual){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Fecha final no puede ser mayor a la actual'
      })
    }
    else if(this.inDesdeR > this.inHasta ){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Fecha de inicio no puede ser mayor a la fecha fin'
      })
    }else if (this.inDesdeR==null || this.inHasta==null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe ingresar una fecha'
      })
    } else if(this.inEstado==9){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccionar un Estado'
      })
     } else {
      this.inDesdeR=this.datePipe.transform(Desde,"dd/MM/yyyy");
    this.inHasta=this.datePipe.transform(Hasta,"dd/MM/yyyy");//
      this.inPer=this.authService.getCodPer()
      this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);  
      this.consolidado=[''];
      let est:any=''
     if(this.inEstado==5){
      est=''
     }else{
       est=$("#estado").val()
     }
     var table = $('#tblConsolidado').DataTable();
     table.clear()
      this.sisgerhService.consolidado(btoa(this.inPer),this.inDesdeR,this.inHasta,est).subscribe(res=>{
        let dtInstance = $('#tblConsolidado').DataTable();
       // dtInstance.destroy();
        this.consolidado=res;
        if(this.consolidado.length!=0){
          $("#divSpin").hide()
          $("#btnImprimir").show()
          
        }else{
         
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No existen datos para el tipo de asistencia'
          })
        $("#btnImprimir").hide()
        

        }
       
        this.dtTrigger.next();
        dtInstance.destroy();
      });
    }

  let tmpFecha=new Date();
  this.inDesde =this.datePipe.transform((tmpFecha.getFullYear()+"-"+(tmpFecha.getMonth() +1) +"-"+ 1),'yyyy-MM-dd');
}

async reporteAsistencia(){
  if(this.consolidado.length==0){
    Swal.fire({
      icon: 'info',
      title: 'Información',
      text: 'No existen datos para impresión'
    })
  }else{

 
  const pdf = new PdfMakeWrapper();
  pdf.info({
    title: 'Asistencia',
    author: 'EEASA'
});
  pdf.pageSize ('A4') ;
  pdf.pageOrientation('portrait');
  pdf.defaultStyle({
  bold: false,
  fontSize: 9
});
pdf.pageMargins([60,200,60,60]);
 pdf.header(new Ul([
  '  ',
  '  ',
  new Columns([  await new Img('assets/Images/logoReporte.png').build(),
  {width: 'auto',text:new Txt('EMPRESA ELÉCTRICA AMBATO REGIONAL CENTRO NORTE S.A                                                                                                  Departamento de Relaciones Industriales                                                                                                  Recursos Humanos').alignment('center').fontSize(12).bold().end,margin: [-20, 15, 0, 0]}
]).end,
new Columns([
  {width: 'auto',text:new Txt('DETALLE DE ASISTENCIA DE PERSONAL').alignment('center').fontSize(12).bold().end,margin: [200, 10, 0, 0]}]).end,
new Columns([
  {width: 'auto',text:new Txt('CÓDIGO:').alignment('center').fontSize(11).bold().end,margin: [30, 10, 0, 0]},{width: 'auto',text:new Txt(this.consolidado[0].ROL).alignment('center').fontSize(10).end,margin: [18, 10, 0, 0]}]).end,
 new Columns([
  {width: 'auto',text:new Txt('NOMBRE:').alignment('center').fontSize(11).bold().end,margin: [30, 2, 0, 0]},{width: 'auto',text:new Txt(this.consolidado[0].NOMBRE).alignment('center').fontSize(10).end,margin: [12, 2, 0, 0]}]).end,
new Columns([
  {width: 'auto',text:new Txt('DESDE:').alignment('center').fontSize(11).bold().end,margin: [30, 2, 0, 0]}, {width: 'auto',text:new Txt(this.inDesdeR).alignment('center').fontSize(10).end,margin: [22, 2, 0, 0]}]).end,
new Columns([
  {width: 'auto',text:new Txt('HASTA:').alignment('center').fontSize(11).bold().end,margin: [30, 2, 0, 0]}, {width: 'auto',text:new Txt(this.inHasta).alignment('center').fontSize(10).end,margin: [21, 2, 0, 0]}]).end
]).type('none').end) 

let tablaAsistencia: any[][] = []; 

tablaAsistencia.push([
  new Txt('Nº').bold().fontSize(8).end,
  new Txt('FECHA').bold().fontSize(8).alignment('center').end,
  new Txt('ABREV.').bold().fontSize(8).alignment('center').end,
  new Txt('TRANSACCIONES REALIZADAS').alignment('center').bold().fontSize(8).end,
  new Txt('DESCRIPCIÓN').alignment('center').bold().fontSize(8).end
]); 
for (let index = 0; index < this.consolidado.length; index++) 
    { 
let row = [];
row.push(index+1)
row.push(this.consolidado[index].FECHA_ASI)
row.push(this.consolidado[index].ABREVIATURA)
row.push(this.consolidado[index].PICADAS)
row.push(this.consolidado[index].DESCRIPCION)
tablaAsistencia.push(row)
    }
tablaAsistencia.push(['','','','',''])
pdf.add(new Table(tablaAsistencia).margin([-20, 0, 0, 0]).headerRows(1).fontSize(8).layout('lightHorizontalLines').widths([20,60,25,175,200]).end)
pdf.add( pdf.ln(1));
//pdf.create().open();
//dfMake.createPdf(docDefinition).open({}, window);
//pdf.create().download('asistencia');
let win:any = window.open('', '_blank');
pdf.create().open({}, win);
}
}
cambio(){
  $("#btnImprimir").hide()
    $("#divSpin").hide()
}
}