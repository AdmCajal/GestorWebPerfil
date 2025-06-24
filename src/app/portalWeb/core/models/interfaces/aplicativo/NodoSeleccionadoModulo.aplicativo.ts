import { ModuloAplicativo } from "./modulo.aplicativo";

export interface NodoSeleccionadoModulo {
    esVisible: boolean,
    tituloDialog: string,
    tipo: string,
    nodo: ModuloAplicativo;
}
