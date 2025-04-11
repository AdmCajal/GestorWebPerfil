export class DtoComprobanteDellate {
    constructor() {

    }
    num:                number;
    IdComprobante:      number;	
    Linea:              number;	
    Componente:         string;	
    Nombre:             string;	
    Descripcion:        string;	
    PeriodoEmision:     string;	
    Compania:           string;	
    Cantidad:           number;	
    Moneda:             string;	
    TipoCambio:         number;	
    MontoAfecto:        number;	
    MontoImpuestoVentas:number;	
    MontoTotal:         number;	
    IdContrato:         number;	
    IdLote:             number;
    Estado:             number;
    FechaCreacion:      Date;
    UsuarioCreacion:    string;
    FechaModificacion:  Date;
    UsuarioModificacion:string;
    DesEstado:          string;
}