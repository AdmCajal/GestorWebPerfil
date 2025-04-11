export class DtoComprobante {
    constructor() {

    }
    num:                    number;
    FechaEmision:           Date;
    IdComprobante:          number;
    TipoComprobante:        string;    
    SerieComprobante:       string;
    NumeroComprobante:      string;
    IdClienteFacturacion:   number;	
    DocumentoCliente:       string;	
    NombreCliente:          string;	
    DireccionCliente:       string;	
    SUNATUbigeo:            string;	
    CorreoElectronico:      string;	
    FormaPago:              string;	
    Descripcion:            string;	
    PeriodoEmision:         string;	
    Compania:               string;	
    Moneda:                 string;	
    TipoCambio:             number;	
    ValorImpuesto:          number;	
    MontoAfecto:            number;	
    MontoTotal:             number;	
    Banco:                  string;	
    CampoReferencia:        string;	
    CuentaBancaria:         string;	
    Observacion:            string;	
    EstadoSunatElectronico: number;	
    CodigoHashElectronico:  string;	
    FechaCancelacion:       Date;	
    FechaVencimiento:       Date;	
    FechaCreacion:          Date;	
    UsuarioCreacion:        string;	
    FechaModificacion:      Date;	
    UsuarioModificacion:    string;	
    DesEstado:              string;	
    NomFormaPago:           string;	
    NomBanco:               string;	
    NomCuentaBancaria:      string;	
    Sucursal:               string;	
    CompaniaCodigo:         string;	
    DescripcionCorta:       string;	
    IdSede:                 number;	
    SedDescripcion:         string;

//INTERES
    TasaInteres:            number;	
    DiasMora:               number;
    TotalMora:              any;
    Codigo:                 string;
}