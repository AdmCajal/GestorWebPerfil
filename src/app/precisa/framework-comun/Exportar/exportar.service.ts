import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { RowInput } from 'jspdf-autotable';
import { jsPDFCustom } from './Interfaces';
import domtoimage from 'dom-to-image';
@Injectable({
  providedIn: 'root'
})
export class ExportarService {

  exportExcel(listaValidacion: Object[], listaExportacion: Object[], nombreExportacion: string) {
    if (listaValidacion == null || listaValidacion == undefined || listaValidacion.length == 0) {
      throw new Error("Exportación fallida, lista vacia.");
    } else {
      import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(listaExportacion);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
        const excelBuffer: any = xlsx.write(workbook, {
          bookType: "xlsx",
          type: "array"
        });
        this.saveAsExcelFile(excelBuffer, nombreExportacion.toUpperCase());
      });
    }
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }

  ExportPdf(listaValidacion: Object[], Cabecera: string[][], rows: RowInput[], nombreExportacion: string, orientacion) {
    if (listaValidacion == null || listaValidacion == undefined || listaValidacion.length == 0) {
      throw new Error("Exportación fallida, lista vacia.");

    } else {
      let doc = new jsPDF(orientacion, 'pt', 'a4') as jsPDFCustom;

      doc.autoTable({
        head: Cabecera,
        body: rows,

      });
      doc.save(nombreExportacion.toUpperCase());
    }
  }


  ExportRecibo(_canvas: HTMLElement, nombre: string) {

    domtoimage.toPng(_canvas).then((dataUrl) => {
      let imagen = new Image();
      imagen.src = dataUrl;
      let pdf = new jsPDF('l', 'mm', 'A7');
      pdf.addImage(imagen, 18, 10, 148, 105); /*imagen: es la captura que insertaremos en el pdf, 18: margen izquierdo, 10: margen superior, 260:ancho, 189:alto, pueden jugar con estos valores, de esta forma me quedó prolijo en A4 horizontal*/
      pdf.save(`${nombre.toUpperCase()}.pdf`);
    }
    );
  }
  constructor() { }
}
