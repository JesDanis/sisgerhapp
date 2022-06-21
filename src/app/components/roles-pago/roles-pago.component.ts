import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import {Meses} from 'src/app/models/meses'
import Swal from 'sweetalert2'
import {DatePipe} from '@angular/common';
import { PdfMakeWrapper,Img, Table, Ul, Line } from 'pdfmake-wrapper';
import {AdministracionService} from 'src/app/guards/administracion.service'

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
   sum_imp:any
   sum_no_imp:any
   suma_des:any
   totalIn:any;
   meses: any[] = [];
   nombre_mes:any
   fecha!:Date;
  anio:any
  mes:any
  zona:any
  regimen:any
  mesActual:any
   totalPago:number=0;
   rect = {
    type: 'rect',
     x: 150,
    y: -15, 
    w: 350,
    h: 0.5,
   color: 'black'
};
txtNomina: string = '0';
  constructor(private datePipe: DatePipe,private sisgerhService:SisgerhMovilService,private authService:AdministracionService) { }

  ngOnInit(): void {
    $("#rolDetalle").hide()
    $("#btnImprimir").hide()
    this.obtenerInformacion();
    this.fecha = new Date();
  fecha : '' 
  this.anio=this.datePipe.transform(this.fecha,"yyyy");
  this.mes=this.datePipe.transform(this.fecha,"MM");
    this.obtenerMeses();
    this.obtenerDatoNomina()
  }
imprimir(){
  this.nomina=[''];
  this.imponibles=[''];
  this.noImponibles=[''];
  this.descuentos=[''];
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
    this.inPer=this.authService.getCodPer()
    this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);
    this.informacion=[''];
    this.sisgerhService.obternerInformacionPer(btoa(this.inPer)).subscribe(res=>{
      this.informacion=res;
      this.informacion=this.informacion[0];
      this.regimen=this.informacion.REGIMEN_LABORAL
      this.zona=this.informacion.ZONA
    });
  }
  obtenerDatoNomina(){
    let Anio=Number($("#inAnio").val());
    let Mes=this.mesActual
    this.nomina=[''];
    this.sisgerhService.obtenerNomina(btoa(this.inPer),Anio,Mes).subscribe((res:any)=>{
      if(res.length>0){
        $("#parametros").hide()
        this.nomina=res;
      }
      })

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
    $("#rolDetalle").show()
    $("#btnImprimir").show()
      let valor: NominaInt = this.nomina.find((s:any) => s.DNMPN_CODIGO == val);
      if (valor)
        this.nombreNomina= valor.DNMPN_NOMBRE_NOMINA;
      let n= $("#inMes").val()
      this.nombre_mes=Meses[Number(n)]

   
    this.resultadoNom=$("#sltNomina").val()
    this.imponibles=[''];
    this.noImponibles=[''];
    this.descuentos=[''];
    this.sum_imp=0
    this.sum_no_imp=0
    this.suma_des=0
    this.totalPago=0
    this.sisgerhService.obtenerRol('obtenerImponibles',this.resultadoNom,btoa(this.inPer)).subscribe(res=>{
      this.imponibles=res;
    }) 
    this.sisgerhService.obtenerRol('obtenerNoImponibles',this.resultadoNom,btoa(this.inPer)).subscribe(res=>{
      this.noImponibles=res;
    }) 
    this.sisgerhService.obtenerRol('obtenerDescuentos',this.resultadoNom,btoa(this.inPer)).subscribe(res=>{
      this.descuentos=res;
    })
    this.obtenerValoresRol(this.inPer)
  } 

obtenerValoresRol(dato:any){
  this.sisgerhService.obtenerRol('obtenerSumaImponibles',this.resultadoNom,btoa(dato)).subscribe(res1=>{
    this.sisgerhService.obtenerRol('obtenerSumaNoImponibles',this.resultadoNom,btoa(dato)).subscribe(res2=>{
      this.sisgerhService.obtenerRol('obtenerSumaDescuentos',this.resultadoNom,btoa(this.inPer)).subscribe(res3=>{
        this.sum_imp=res1
        this.sum_imp=this.sum_imp[0].SUMA
          if(this.sum_imp==null){
            this.sum_imp=0
          }
        this.sum_no_imp=res2
        this.sum_no_imp=this.sum_no_imp[0].SUMA
        if(this.sum_no_imp==null){
          this.sum_no_imp=0
        }
        this.suma_des=res3
        this.suma_des=this.suma_des[0].SUMA
        if(this.suma_des==null){
          this.suma_des=0
        }
        let ing =parseFloat(this.sum_imp)+parseFloat(this.sum_no_imp)
        this.totalIn=Math.round(ing*100)/100
        let total=(parseFloat(this.totalIn)-parseFloat(this.suma_des))
        this.totalPago=Math.round(total*100)/100 
      })
    })
  }) 
}

  async reporteRol(){
    this.resultadoNom=$("#sltNomina").val()
    let regimen=this.regimen
    let longitud = regimen.length
    //CODIGO DEL TRABAJO
    let h =0
    if(longitud <= 18){
      h =240
    }else{
      h=200
    }
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
    pdf.pageSize ('A5') ;
    pdf.pageOrientation('landscape');
    pdf.defaultStyle({
    bold: false,
    fontSize: 9
  });
  pdf.pageMargins([10,200,60,10]);
   pdf.header(new Ul([
    '  ',
    '  ',
    new Columns([  await new Img('assets/Images/logoReporte.png').build(),
    {width: 'auto',text:new Txt('ROL DE PAGOS INDIVIDUAL').alignment('center').fontSize(11).bold().end,margin: [0, 0, 200, 10]}
  ]).end,
   {canvas: [this.rect]},
   new Columns([
    {width: 'auto',text:new Txt(regimen).alignment('center').fontSize(10).bold().end,margin: [h, 5, 0, 0]}
  ]).end,
  new Columns([
    {width: 'auto',text:new Txt(this.nombreNomina).alignment('center').fontSize(10).bold().end,margin: [180, 5, 0, 0]}
  ]).end,
  new Columns([
    {width: 'auto',text:new Txt(this.zona+' - '+this.nombre_mes+'/'+$("#inAnio").val()).alignment('center').fontSize(10).bold().end,margin: [220, 5, 0, 0]}
  ]).end
  ]).type('none').end) 
  let tablaDatos: any[][] = []; 
  let rowD = [];
  rowD.push(new Txt('DEPARTAMENTO: ').bold().fontSize(7).end)
  rowD.push( new Txt(this.informacion.DEPARTAMENTO).fontSize(7).end)
  rowD.push("")
  rowD.push("")
  rowD.push("")
  rowD.push("")
  let rowN=[]
  rowN.push(new Txt('NOMBRES: ').bold().fontSize(7).end)
  rowN.push(new Txt(this.informacion.NOMBRE_EMPLEADO).fontSize(7).end)
  rowN.push(new Txt('CÓDIGO: ').bold().fontSize(7).end)
  rowN.push(new Txt(this.informacion.ROL).fontSize(7).end)
  rowN.push("")
  rowN.push("")
  let rowC=[]
  rowC.push(new Txt('CARGO: ').bold().fontSize(7).end)
  rowC.push(new Txt(this.informacion.CARGO).fontSize(7).end)
  rowC.push(new Txt('RMU: ').bold().fontSize(7).end)
  rowC.push(new Txt(this.informacion.RMU).fontSize(7).end)
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
      new Txt('INGRESOS IMPONIBLES').bold().fontSize(7).alignment('center').end,
      new Txt('INGRESOS NO IMPONIBLES').bold().fontSize(7).alignment('center').end,
      new Txt('DESCUENTOS').bold().fontSize(7).alignment('center').end
    ]);  
 //IMPONIBLES
 tablaRolImp.push([
  new Txt('CONCEPTO').bold().fontSize(7).alignment('center').end,
   new Txt('VALOR').bold().fontSize(7).alignment('center').end
 ]);

 for (let i = 0; i < this.imponibles.length; i++) 
   {
    let rowImp = [];
   rowImp.push(new Txt(this.imponibles[i].DNMRU_ABREVIATURA ).fontSize(6).alignment('left').end)
   rowImp.push(new Txt(this.imponibles[i].DNMNC_VALOR ).fontSize(6).alignment('right').end)
   tablaRolImp.push(rowImp)
   }
   let rowTImp=[]
   rowTImp.push(new Txt('TOTAL').bold().fontSize(7).alignment('center').end)
   rowTImp.push(new Txt(this.sum_imp).bold().fontSize(7).alignment('right').end)
   tablaRolImp.push(rowTImp)
  //NO IMPONIBLES
 tablaRolNo.push([
  new Txt('CONCEPTO').bold().fontSize(7).alignment('center').end,
   new Txt('VALOR').bold().fontSize(7).alignment('right').end
 ]);
 
 for(let j=0;j<this.noImponibles.length;j++)
   {
    let rowNo = [];
    rowNo.push(new Txt(this.noImponibles[j].DNMRU_ABREVIATURA ).fontSize(6).alignment('left').end)
    rowNo.push(new Txt(this.noImponibles[j].DNMNC_VALOR ).fontSize(6).alignment('right').end)
    tablaRolNo.push(rowNo)
   }
   let rowTNoImp=[]
   rowTNoImp.push(new Txt('TOTAL').bold().fontSize(7).alignment('center').end)
   rowTNoImp.push(new Txt(this.sum_no_imp).bold().fontSize(7).alignment('right').end)
   tablaRolNo.push(rowTNoImp)
//DESCUENTOS
 tablaRolDes.push([
  new Txt('CONCEPTO').bold().fontSize(7).alignment('center').end,
   new Txt('VALOR').bold().fontSize(7).alignment('right').end
 ]);
 for(let k =0;k<this.descuentos.length;k++){
  let rowDes = [];
  rowDes.push(new Txt(this.descuentos[k].DNMRU_ABREVIATURA ).fontSize(6).alignment('left').end)
  rowDes.push(new Txt(this.descuentos[k].DNMNC_VALOR ).fontSize(6).alignment('right').end)
  tablaRolDes.push(rowDes)
 }
 let rowTDes=[]
 rowTDes.push(new Txt('TOTAL').bold().fontSize(7).alignment('center').end)
 rowTDes.push(new Txt(this.suma_des).bold().fontSize(7).alignment('right').end)
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
  new Txt('TOTAL INGRESOS').bold().fontSize(7).alignment('left').end,
  new Txt(this.totalIn.toString()).fontSize(7).alignment('right').end,
])
tablasTotales.push([
  new Txt('TOTAL DESCUENTOS').bold().fontSize(7).alignment('left').end,
  new Txt(this.suma_des).fontSize(7).alignment('right').end,
])
tablasTotales.push([
  new Txt('LIQUIDO A PAGAR').bold().fontSize(7).alignment('left').end,
  new Txt(this.totalPago.toString()).bold().fontSize(7).alignment('right').end,
])

 let longNo=this.noImponibles.length
 let longImp=this.imponibles.length;
 let v1=-26
 let aux=1
 if (longImp!=0){
   aux=longImp*10
   v1=-30-aux
 }
 let v2=-26
 let aux2=1
 if (longNo!=0){
   aux2=longNo*10
   v2=-30-aux2
 }
 pdf.add(new Table(tablaDatos).margin([40, -60, 0, 0]).headerRows(0).layout('noBorders').widths([90,250,50,100,50,100]).end)
 pdf.add(new Table(tablaRolC).margin([20, 30, 0, 0]).headerRows(1).layout('headerLineOnly').widths([145,180,180]).end)
 pdf.add(new Table(tablaRolImp).margin([20, 0, 10, v1]).headerRows(1).layout('headerLineOnly').widths([80,50]).end)
 pdf.add(new Table(tablaRolNo).margin([200, 0, 0, v2]).headerRows(1).layout('headerLineOnly').widths([80,50]).end)
 pdf.add(new Table(tablaRolDes).margin([400, 0, 0, 0]).headerRows(1).layout('headerLineOnly').widths([60,50]).end)
 pdf.add(new Table(tablasTotales).margin([400, 0, 0, 0]).headerRows(0).layout('headerLineOnly').widths([80,30]).end)
pdf.add( pdf.ln(1));
 //pdf.create().open();
 // pdf.create().download(this.nombreNomina);
  let win:any = window.open('', '_blank');
  pdf.create().open({}, win);
  }
}
}
