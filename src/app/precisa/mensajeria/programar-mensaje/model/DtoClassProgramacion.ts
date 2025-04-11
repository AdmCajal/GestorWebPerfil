import { Dtoprogramacion } from "./DtoProgramacion";
import { Dtoprogramaciondetalle } from "./Dtoprogramaciondetalle";


export class DtoClassProgramacion {
    constructor() {
        this.Programacion;
        this.Detalle=[]; 
        
    }
    
    success:        boolean;
    tokem:          string;
    Programacion:   Dtoprogramacion;
    Detalle:        Dtoprogramaciondetalle[];
}