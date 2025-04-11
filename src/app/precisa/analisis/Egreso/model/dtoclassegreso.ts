import { DtoEgreso } from "./dtoegreso";
import { DtoEgresoDetalle } from "./dtoegresodetalle";

export class DtoClassEgreso {
  


    constructor() {
        this.Detalle=[];
        this.Egreso;  
    }


    success:   boolean;
    tokem:     string;
    Egreso:    DtoEgreso;
    Detalle:   DtoEgresoDetalle[];
 

}