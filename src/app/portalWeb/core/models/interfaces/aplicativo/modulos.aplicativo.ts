export interface ModuloAplicativo {
    key: number;
    label: string;
    icon: string;
    data: string;
    url: string;
    tipoNodo: string;
    sobreEscribir: boolean;
    esEditable: boolean;
    children: ModuloAplicativo[];
}
