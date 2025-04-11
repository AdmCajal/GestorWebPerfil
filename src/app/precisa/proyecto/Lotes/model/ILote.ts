import jsPDF from "jspdf";
import { UserOptions } from "jspdf-autotable";

export interface ILote {
  NRO: number;
  FECHA:string;
  COMPAÑIA: string;
  SUCURSAL: string;
  PROGRAMA: string;
  MANZANA: string;
  LOTE: string;
  AREA_M2: string;
  PRECIO_M2: string;
  MONTO_TOTAL: string;
  // PRECIO_M2_SOLES: string;
  // MONTO_TOTAL_SOLES: string;
  UBICACION: string;
  DIRECCION: string;
  ESTADO_CAMPO_DETALLE: string;
  ESTADO_LOTE: string;
  TIPO_LOTE:string;
  TIPO_INTERES:string;
  MOROSIDAD: number;
  // DIAS_DE_GRACIA: string;
  TIPO_DE_CAMBIO: string;
  MONEDA: string;
  OBSERVACION:string;
  UBIGEO: string;
  ESTADO: string;
}
export interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}
