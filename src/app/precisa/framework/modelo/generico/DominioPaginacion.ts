export class DominioPaginacion {
    constructor(){
        this.paginacionRegistroInicio = 0;
    }

    paginacionRegistroInicio: number;
    paginacionListaResultado: any[];
    paginacionRegistrosEncontrados: number;
    paginacionRegistrosPorPagina: number;
    paginacionOrdenDireccion: string;
    paginacionOrdenAtributo: string;
}