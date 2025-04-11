import { DtoContrato } from "../../Contrato/model/DtoContrato";
import { DtoInteres } from "../../Interes/model/Dtointeres";
import { DtoComprobante } from "./Dtocomprobante";
import { DtoLetra } from "./dtoLetra";


export class DtoClassComprobante {
    constructor() {
        this.Comprobante;
        this.Detalle=[];
        this.Interes;
        
    }
    success:        boolean;
    tokem:          string;
    Comprobante:    DtoContrato;
    Detalle:        DtoLetra[];
    Interes:        DtoInteres;
}