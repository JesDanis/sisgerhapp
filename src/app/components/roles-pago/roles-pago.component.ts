import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import {Meses} from 'src/app/models/meses'
import Swal from 'sweetalert2'
import {DatePipe} from '@angular/common';
import { PdfMakeWrapper,Img, Table, Ul, Line } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Txt, Columns} from 'pdfmake-wrapper';
import {NominaInt} from '../../models/rolPagos/nomina-int'
PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-roles-pago',
  templateUrl: './roles-pago.component.html',
  styleUrls: ['./roles-pago.component.css']
})
export class RolesPagoComponent implements OnInit {
  
   selectElement:any = document.querySelector('#sltRol');
   resultadoNom:any
   informacion:any;
   nomina:any;
   nombreNomina:any
   imponibles:any;
   noImponibles:any;
   descuentos:any;
   inPer:any;
   inAnio:number=0;
   inMes:number=0;
   ingIm:number=0;
   ingNo:number=0;
   desc:number=0;
   totalIn:any;
   meses: any[] = [];
   fecha!:Date;
  anio:any
  mes:any
  mesActual:any
   totalPago:number=0;
   rect = {
    type: 'rect',
     x: 150,
    y: -20, 
    w: 600,
    h: 0.5,
   color: 'black'
};
txtNomina: string = '0';
  constructor(private datePipe: DatePipe,private sisgerhService:SisgerhMovilService) { }

  ngOnInit(): void {
    $("#rolDetalle").hide()
    this.obtenerInformacion();
    this.fecha = new Date();
  fecha : '' 
  this.anio=this.datePipe.transform(this.fecha,"yyyy");
  this.mes=this.datePipe.transform(this.fecha,"MM");
    this.obtenerMeses();
  }
imprimir(){
  this.nomina=[''];
  this.imponibles=[''];
  this.noImponibles=[''];
  this.descuentos=[''];
  this.ingNo=0
  this.ingIm=0
  this.desc=0
  this.totalIn=0
  this.totalPago=0
  $("#parametros").show()
  $("#rolDetalle").hide()

}
obtenerMeses(): void {
  for (let mes in Meses) {
    if (isNaN(Number(mes))) {
      this.meses.push({ text: mes, value: Meses[mes] });
    }
  }
  this.mesActual = Number(((new Date).getMonth()) + 1).toString();

}
  obtenerInformacion(){
    this.inPer=localStorage.getItem('codPer');
    this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
    this.informacion=[''];
    this.sisgerhService.obternerInformacionPer(btoa(this.inPer)).subscribe(res=>{
      this.informacion=res;
      this.informacion=this.informacion[0];
    });
  }
  obtenerNomina(){  
    
    this.inAnio=Number($("#inAnio").val());
    this.inMes=Number($("#inMes").val())
    if(this.inAnio== this.anio && this.inMes>this.mesActual){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Mes seleccionado fuera de límite'
      })
     }else if(this.inAnio==0 || this.inAnio>this.anio){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Año incorrecto'
      })
     }
     else{
     
    this.nomina=[''];
    this.sisgerhService.obtenerNomina(btoa(this.inPer),this.inAnio,this.inMes).subscribe((res:any)=>{
      if(res.length>0){
        $("#parametros").hide()
        $("#rolDetalle").show()
        this.nomina=res;
      }else{
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'No se ha encontrado información en el tiempo establecido'
        })
      }
      
    })
  }
  }
  obtenerIngresos(val:any){
    
      let valor: NominaInt = this.nomina.find((s:any) => s.DNMPN_CODIGO == val);
      if (valor)
        this.nombreNomina= valor.DNMPN_NOMBRE_NOMINA;

    this.ingIm=0
    this.ingNo=0
    this.desc=0
    this.totalIn=0
    this.totalPago=0
    this.resultadoNom=$("#sltNomina").val()
    this.imponibles=[''];
    this.noImponibles=[''];
    this.descuentos=[''];
    let suma=0
    this.sisgerhService.obtenerRol('obtenerImponibles',this.resultadoNom,btoa(this.inPer)).subscribe(res=>{
      this.imponibles=res;
      console.log(this.imponibles)
      for (const i in this.imponibles){
        this.ingIm+=parseFloat(this.imponibles[i].DNMNC_VALOR);
      }
    }) 
    this.sisgerhService.obtenerRol('obtenerNoImponibles',this.resultadoNom,btoa(this.inPer)).subscribe(res=>{
      this.noImponibles=res;
      for (const i in this.noImponibles){
        this.ingNo+=parseFloat(this.noImponibles[i].DNMNC_VALOR);
      }
      
      let total=this.ingIm+this.ingNo
      this.ingNo=Math.round(this.ingNo*100)/100
      this.ingIm=Math.round(this.ingIm*100)/100
      this.totalIn=this.ingIm+this.ingNo//Math.round((this.ingIm+this.ingNo)*100)/100
      })
    this.sisgerhService.obtenerRol('obtenerDescuentos',this.resultadoNom,btoa(this.inPer)).subscribe(res=>{
      this.descuentos=res;
      for (const i in this.descuentos){
        this.desc+=parseFloat(this.descuentos[i].DNMNC_VALOR);
      }
      let liq=this.totalIn-this.desc
      this.desc=Math.round(this.desc*100)/100

      this.totalPago= Math.round(liq*100)/100
      })
  }
  async reporteRol(){
    this.resultadoNom=$("#sltNomina").val()
    if(this.resultadoNom==0){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccionar una Nómina'
      })
     }
     else{
    const pdf = new PdfMakeWrapper();
    pdf.info({
      title: 'Rol de pago',
      author: 'EEASA'
  });
    pdf.pageSize ('A4') ;
    pdf.pageOrientation('landscape');
    pdf.defaultStyle({
    bold: false,
    fontSize: 9
  });
  pdf.pageMargins([60,200,60,60]);
   pdf.header(new Ul([
    '  ',
    '  ',
    new Columns([  await new Img('assets/Images/logoReporte.png').build(),
    {width: 'auto',text:new Txt('EMPRESA ELÉCTRICA AMBATO REGIONAL CENTRO NORTE S.A                                                                                                                                                ROL DE PAGOS INDIVIDUAL').alignment('center').fontSize(12).bold().end,margin: [-20, 15, 0, 0]}]).end,
   {canvas: [this.rect]},
   new Columns([
    {width: 'auto',text:new Txt('CÓDIGO DEL TRABAJO').alignment('center').fontSize(12).bold().end,margin: [400, 0, 0, 0]}
  ]).end,
  new Columns([
    {width: 'auto',text:new Txt(this.nombreNomina).alignment('center').fontSize(12).bold().end,margin: [320, 5, 0, 0]}
  ]).end,
  new Columns([
    {width: 'auto',text:new Txt('TUNGURAHUA - MAYO/2021').alignment('center').fontSize(12).bold().end,margin: [395, 5, 0, 0]}
  ]).end
  ]).type('none').end) 
  let tablaDatos: any[][] = []; 
  let rowD = [];
  rowD.push(new Txt('DEPARTAMENTO: ').bold().fontSize(8).end)
  rowD.push( this.informacion.DEPARTAMENTO)
  rowD.push("")
  rowD.push("")
  rowD.push("")
  rowD.push("")
  let rowN=[]
  rowN.push(new Txt('NOMBRES: ').bold().fontSize(8).end)
  rowN.push(this.informacion.NOMBRE_EMPLEADO)
  rowN.push(new Txt('CÓDIGO: ').bold().fontSize(8).end)
  rowN.push(this.informacion.ROL)
  rowN.push("")
  rowN.push("")
  let rowC=[]
  rowC.push(new Txt('CARGO: ').bold().fontSize(8).end)
  rowC.push(this.informacion.CARGO)
  rowC.push(new Txt('RMU: ').bold().fontSize(8).end)
  rowC.push(this.informacion.RMU)
  rowC.push("")
  rowC.push("")
  tablaDatos.push(rowD)
  tablaDatos.push(rowN)
  tablaDatos.push(rowC)
  let tablaRolC: any[][] = [];
  let tablaRolImp: any[][] = [];
  let tablaRolNo: any[][] = [];
  let tablaRolDes: any[][] = [];

  
    tablaRolC.push([
      new Txt('INGRESOS IMPONIBLES').bold().fontSize(8).alignment('center').end,
      new Txt('INGRESOS NO IMPONIBLES').bold().fontSize(8).alignment('center').end,
      new Txt('DESCUENTOS').bold().fontSize(8).alignment('center').end
    ]);  
 //IMPONIBLES
 tablaRolImp.push([
  new Txt('CONCEPTO').bold().fontSize(8).alignment('center').end,
   new Txt('VALOR').bold().fontSize(8).alignment('center').end
 ]);

 for (let i = 0; i < this.imponibles.length; i++) 
   {
    let rowImp = [];
   rowImp.push(new Txt(this.imponibles[i].DNMRU_ABREVIATURA ).fontSize(8).alignment('left').end)
   rowImp.push(new Txt(this.imponibles[i].DNMNC_VALOR ).fontSize(8).alignment('right').end)
   tablaRolImp.push(rowImp)
   }
   let rowTImp=[]
   rowTImp.push(new Txt('TOTAL').bold().fontSize(8).alignment('center').end)
   rowTImp.push(new Txt(this.ingIm.toString()).bold().fontSize(8).alignment('right').end)
   tablaRolImp.push(rowTImp)
  //NO IMPONIBLES
 tablaRolNo.push([
  new Txt('CONCEPTO').bold().fontSize(8).alignment('center').end,
   new Txt('VALOR').bold().fontSize(8).alignment('right').end
 ]);
 
 for(let j=0;j<this.noImponibles.length;j++)
   {
    let rowNo = [];
    rowNo.push(new Txt(this.noImponibles[j].DNMRU_ABREVIATURA ).fontSize(8).alignment('left').end)
    rowNo.push(new Txt(this.noImponibles[j].DNMNC_VALOR ).fontSize(8).alignment('right').end)
    tablaRolNo.push(rowNo)
   }
   let rowTNoImp=[]
   rowTNoImp.push(new Txt('TOTAL').bold().fontSize(8).alignment('center').end)
   rowTNoImp.push(new Txt(this.ingNo.toString()).bold().fontSize(8).alignment('right').end)
   tablaRolNo.push(rowTNoImp)
//DESCUENTOS
 tablaRolDes.push([
  new Txt('CONCEPTO').bold().fontSize(8).alignment('center').end,
   new Txt('VALOR').bold().fontSize(8).alignment('right').end
 ]);
 for(let k =0;k<this.descuentos.length;k++){
  let rowDes = [];
  rowDes.push(new Txt(this.descuentos[k].DNMRU_ABREVIATURA ).fontSize(8).alignment('left').end)
  rowDes.push(new Txt(this.descuentos[k].DNMNC_VALOR ).fontSize(8).alignment('right').end)
  tablaRolDes.push(rowDes)
 }
 let rowTDes=[]
 rowTDes.push(new Txt('TOTAL').bold().fontSize(8).alignment('center').end)
 rowTDes.push(new Txt(this.desc.toString()).bold().fontSize(8).alignment('right').end)
 tablaRolDes.push(rowTDes)
let tablasTotales: any[][] = []
tablasTotales.push([
  '',
  ''
])
tablasTotales.push([
  '',
  ''
])
tablasTotales.push([
  new Txt('TOTAL INGRESOS').bold().fontSize(8).alignment('left').end,
  new Txt(this.totalIn.toString()).fontSize(8).alignment('right').end,
])
tablasTotales.push([
  new Txt('TOTAL DESCUENTOS').bold().fontSize(8).alignment('left').end,
  new Txt(this.desc.toString()).fontSize(8).alignment('right').end,
])
tablasTotales.push([
  new Txt('LIQUIDO A PAGAR').bold().fontSize(8).alignment('left').end,
  new Txt(this.totalPago.toString()).bold().fontSize(8).alignment('right').end,
])

 let longNo=this.noImponibles.length
 let longImp=this.imponibles.length;
 let v1=-30
 let aux=1
 if (longImp!=0){
   aux=longImp*12.5
   v1=-30-aux
 }
 let v2=-30
 let aux2=1
 if (longNo!=0){
   aux2=longNo*12.5
   v2=-30-aux2
 }
 pdf.add(new Table(tablaDatos).margin([40, -30, 0, 0]).headerRows(0).layout('noBorders').widths([90,250,50,100,50,100]).end)
 pdf.add(new Table(tablaRolC).margin([0, 30, 0, 0]).headerRows(1).layout('headerLineOnly').widths([219,219,219]).end)
 pdf.add(new Table(tablaRolImp).margin([0, 0, 10, v1]).headerRows(1).layout('headerLineOnly').widths([120,90]).end)
 pdf.add(new Table(tablaRolNo).margin([240, 0, 0, v2]).headerRows(1).layout('headerLineOnly').widths([120,90]).end)
 pdf.add(new Table(tablaRolDes).margin([475, 0, 0, 0]).headerRows(1).layout('headerLineOnly').widths([120,90]).end)
 pdf.add(new Table(tablasTotales).margin([475, 0, 0, 0]).headerRows(0).layout('headerLineOnly').widths([120,90]).end)
pdf.add( pdf.ln(1));
 //pdf.create().open();
  pdf.create().download('rol_pagos');
  }
}
}
