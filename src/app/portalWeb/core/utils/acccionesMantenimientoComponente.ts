export interface AcccionesMantenimientoComponente {
    visualizarLogMoficaciones: boolean;

    estructuraForm(): void;
    obtenerDatosSelect(): void;
    obtenerDatosMantenimiento(): void;

    guardarMantenimiento(): void;
}