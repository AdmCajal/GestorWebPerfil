import { FormGroup } from "@angular/forms";
import { AccionFormulario } from "../enums/accionFormulario.enum";

export declare interface AccionesBusquedaComponente {
    filtroForm: FormGroup;
    bloquearComponente: boolean;
    barraBusqueda: boolean;

    estructuraForm(): void;
    obtenerDatosSelect(): void;

    btnBuscar(): void;
    inactivarRegistro(registro: any): void;
    btnExportar(): void;
    btnMantenimientoFormulario(accion: AccionFormulario, registro?: any): void;

    rptaMantenimiento(respuesta: any): void;


}