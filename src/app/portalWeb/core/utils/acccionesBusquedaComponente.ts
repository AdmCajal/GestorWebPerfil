export declare interface AccionesBusquedaComponente {
    bloquearComponente: boolean;
    barraBusqueda: boolean;

    estructuraForm(): void;
    obtenerDatosSelect(): void;

    btnBuscar(): void;
    inactivarRegistro(registro: any): void;
    btnExportar(): void;
    btnMantenimientoFormulario(accion: 'AGREGAR' | 'EDITAR' | 'VER', registro?: any): void;

    rptaMantenimiento(respuesta: any): void;


}