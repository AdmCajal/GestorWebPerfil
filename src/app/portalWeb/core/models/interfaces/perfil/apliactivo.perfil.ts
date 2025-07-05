import { ModuloAplicativo } from "../aplicativo/modulo.aplicativo";

export interface AplicativoPerfil {
    Sistema: string,
    Nombre: string,
    modulos: ModuloAplicativo[],
    modulosSeleccionados: ModuloAplicativo[]
}
