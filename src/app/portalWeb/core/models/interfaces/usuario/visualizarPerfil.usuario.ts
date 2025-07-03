import { ModuloAplicativo } from "../aplicativo/modulo.aplicativo";

export interface VisualizarPerfilUsuario {
    nombrePerfil: string
    aplicativos: {
        Sistema: string,
        Nombre: string,
        Descripcion: string,
        UrlSistema: string,
        Estado: number,
        DesEstado: string,
        modulos: ModuloAplicativo[]
    }[];
}