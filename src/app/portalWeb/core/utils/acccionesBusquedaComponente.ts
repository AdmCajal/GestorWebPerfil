export declare interface AccionesBusquedaComponente {
    estructuraForm(): void;
    obtenerDatosSelect(): void;


    btnBuscar(): void;
    btnInactivar(registro: any): void;
    btnExportar(): void;

    btnMantenimientoFormulario(accion: 'AGREGAR' | 'EDITAR' | 'VER', registro?: any): void;
    rptaMantenimiento(respuesta: any): void;

    bloquearComponente: boolean;
    barraBusqueda: boolean;
}