export interface ModuloAplicativo {
    key: number;
    label: string;
    icon: string;
    data: string;
    url: string;

    codigoObj: string;
    icono:string;
    tipoNodo: string;
    sobreEscribir: boolean;
    esEditable: boolean;
    children: ModuloAplicativo[];
}
