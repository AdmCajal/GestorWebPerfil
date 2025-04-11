import { DtoMenu } from "./DtoMenu";
import { UIMantenimientoController } from "./UIMantenimientoController";

export class ObjetoTitulo{  
    constructor(){
        this.menuSeguridad = new DtoMenu();
        this.listaOtros = [];        
    }

    listaOtros: any[];
    titulo: string;
    tipo: number;
    menuSeguridad: DtoMenu;
    componente: UIMantenimientoController;

    //Mantenimiento
    accion: string;
    puedeEditar: boolean;            
}

