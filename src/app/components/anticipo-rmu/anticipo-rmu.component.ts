import { Component, OnInit } from '@angular/core';
import { SisgerhMovilService } from "src/app/services/sisgerh-movil.service";
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import { PdfMakeWrapper,Img, Table, Ul, Line } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2'
import { Txt, Columns} from 'pdfmake-wrapper';
import {Router} from '@angular/router';
PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-anticipo-rmu',
  templateUrl: './anticipo-rmu.component.html',
  styleUrls: ['./anticipo-rmu.component.css']
})
export class AnticipoRmuComponent implements OnInit {
  anticipoInf:any;
  anticipoDet:any;
  codigo:any=''
  inPer:any;
  monto:any
  saldo:any
  total_cuotas:any
  valor_cuota:any
  tipo_pago:any
  cuotas_pend:any
  solicitante:any
  garante:any
  numero_solicitud:any
  fecha_aprueba:any
  tipo_prestamo:any
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private sisgerhService:SisgerhMovilService, private route:Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
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
        },  {
          targets: [1, 2,7,9,10 ],
          className: 'dt-body-left',
        },  {
          targets: [4,5,6 ],
          className: 'dt-body-right',
        }
      ]
    };
    this.verificarExistencia()
  }

  verificarExistencia(){
  this.inPer=localStorage.getItem('codPer');
  this.inPer=CryptoJS.AES.decrypt(this.inPer.toString(),'eeasaPer').toString(CryptoJS.enc.Utf8);

    this.sisgerhService.obtenerInformacionAnticipo(btoa(this.inPer)).subscribe((res:any)=>{
      if(res.length==0){
        $("#btnImprimir").hide()
        $("#divDetalles").hide()
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'No cuenta con Anticipos'
        })
        this.route.navigate(['/laboral']);
      }else{
        $("#btnImprimir").show()
        $("#divDetalles").show()
        this.anticipoInf=res
        this.anticipoInf=this.anticipoInf[0]
        this.codigo= this.anticipoInf.DSSAP_CODIGO

        this.saldo=this.anticipoInf.SALDO
        this.monto=this.anticipoInf.MONTO
        this.total_cuotas=this.anticipoInf.TOTAL_CUOTAS
        this.cuotas_pend=this.anticipoInf.CUOTAS_PENDIENTES
        this.valor_cuota=this.anticipoInf.VALOR_CUOTA
        this.tipo_pago=this.anticipoInf.TIPO_PAGO
        this.solicitante=this.anticipoInf.NOMBRE_SOLICITANTE
       this.garante =this.anticipoInf.NOMBRES_GARANTE
        this.numero_solicitud=this.anticipoInf.NUMERO_SOLICITUD
        this.fecha_aprueba=this.anticipoInf.FECHA_APRUEBA
        this.tipo_prestamo=this.anticipoInf.TIPO_PRESTAMO
        this.anticipoDet=['']
        this.sisgerhService.obtenerDetalleAnticipo(this.codigo).subscribe(res=>{
          this.anticipoDet=res
          this.dtTrigger.next();
           })
      }
      
  
    })
  }

  async reportePagos(){
  
const pdf = new PdfMakeWrapper();
   pdf.info({
     title: 'Anticipos',
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
   {width: 'auto',text:new Txt('DETALLE DE PAGOS').alignment('center').fontSize(12).bold().end,margin: [250, 10, 0, 0]}]).end,
 new Columns([
   {width: 'auto',text:new Txt('SOLICITANTE:').alignment('center').fontSize(11).bold().end,margin: [30, 2, 0, 0]},
   {width: 'auto',text:new Txt(this.anticipoInf.NOMBRE_SOLICITANTE).alignment('center').fontSize(10).end,margin: [12, 2, 0, 0]}]).end,
 new Columns([
   {width: 'auto',text:new Txt('GARANTE:').alignment('center').fontSize(11).bold().end,margin: [30, 2, 0, 0]}, 
   {width: 'auto',text:new Txt(this.anticipoInf.NOMBRES_GARANTE).alignment('center').fontSize(10).end,margin: [29, 2, 0, 0]}]).end,
 new Columns([
   {width: 'auto',text:new Txt('Nº SOLICITUD:').alignment('center').fontSize(11).bold().end,margin: [30, 2, 0, 0]}, 
   {width: 'auto',text:new Txt(this.anticipoInf.NUMERO_SOLICITUD).alignment('center').fontSize(10).end,margin: [11, 2, 0, 0]}]).end,
   new Columns([
    {width: 'auto',text:new Txt('FECHA:').alignment('center').fontSize(11).bold().end,margin: [30, 2, 0, 0]}, 
    {width: 'auto',text:new Txt(this.anticipoInf.FECHA_APRUEBA).alignment('center').fontSize(10).end,margin: [44, 2, 0, 0]}]).end,
    new Columns([
      {width: 'auto',text:new Txt('TIPO:').alignment('center').fontSize(11).bold().end,margin: [30, 2, 0, 0]}, 
      {width: 'auto',text:new Txt(this.anticipoInf.TIPO_PRESTAMO).alignment('center').fontSize(10).end,margin: [54, 2, 0, 0]}]).end
    
  
 ]).type('none').end) 

 let tablaPagos: any[][] = []; 

 tablaPagos.push([
   new Txt('Nº').bold().fontSize(8).end,
   new Txt('QUINCENA').bold().fontSize(7).alignment('center').end,
   new Txt('MES').bold().fontSize(7).alignment('center').end,
   new Txt('AÑO').alignment('center').bold().fontSize(7).end,
   new Txt('VALOR').alignment('center').bold().fontSize(7).end,
   new Txt('DSC').alignment('center').bold().fontSize(7).end,
   new Txt('SALDO').alignment('center').bold().fontSize(7).end,
   new Txt('ESTADO').alignment('center').bold().fontSize(7).end,
   new Txt('F. DESCUENTO').alignment('center').bold().fontSize(7).end,
   new Txt('NÓMINA').alignment('center').bold().fontSize(7).end


 ]); 
for (let index = 0; index < this.anticipoDet.length; index++) 
     { 
 let row = [];
 row.push(this.anticipoDet[index].DSSCP_INDICE)
 row.push(this.anticipoDet[index].QUINCENA)
 row.push(this.anticipoDet[index].MES)
 row.push(this.anticipoDet[index].ANIO)
 row.push(new Txt(this.anticipoDet[index].VALOR).alignment('right').end)
 row.push(new Txt(this.anticipoDet[index].VALOR_DESC).alignment('right').end)
 row.push(new Txt(this.anticipoDet[index].SALDO).alignment('right').end)
 row.push(this.anticipoDet[index].ESTADO_CUOTA)
 row.push(this.anticipoDet[index].FECHA_DESCUENTO)
 row.push(this.anticipoDet[index].NOMINA)
 tablaPagos.push(row)
     }
 tablaPagos.push(['','','','','','','','','',''])
 pdf.add(new Table(tablaPagos).margin([-20, 0, 0, 0]).headerRows(1).fontSize(7).layout('lightHorizontalLines').widths([10,35,46,17,30,30,30,42,48,100]).end)
 pdf.add( pdf.ln(1));
 //pdf.create().open();
 let win:any = window.open('', '_blank');
pdf.create().open({}, win);
 //pdf.create().download('anticipo');
 }
}
