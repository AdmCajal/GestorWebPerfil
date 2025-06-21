export declare interface AccionesVistaComponente {
    btnMantenimientoFormulario(accion: 'AGREGAR' | 'EDITAR' | 'VER', registro?: any): void;
    btnBuscar(): void;
    btnExportar(): void;

    bloquearComponente: boolean;
    barraBusqueda: boolean;
}