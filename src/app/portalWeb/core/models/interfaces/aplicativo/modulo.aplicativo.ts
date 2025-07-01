export interface ModuloAplicativo {
    key: number;
    icon: string;
    label: string;
    data: string;
    url: string;

    IdOpcionPadre: number;
    codigoObj: string;
    icono: string;
    tipoNodo: string;
    sobreEscribir: boolean;
    esEditable: boolean;
    Compania: string;
    DescripcionCorta: string;
    Sistema: string;
    NivelOpcion: number;
    Orden: number;
    children: ModuloAplicativo[];
}
