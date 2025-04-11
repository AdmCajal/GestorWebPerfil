export class DtoContrato {
    constructor() {
    }

//  VARIABLES DE INCORMPORADAS
    num:                number;
    Saldo:              number;

//  VARIABLES DE LA CONSULTA    
    CompaniaCodigo:     string;
    NomProyecto:        string;
    DescripcionCorta:   string;
    IdSede:             number;
    SedDescripcion:     string;
    DesCondicion:       string;
    DesSituacion:       string;
    Situacion:          number;
    DesUbicacion:       string;
    NomManzana:         string;
    TipoDocumento:      string;
    Documento:          string;
    Cliente:            string;
    DocumentoVen:       string;
    Vendedor:           string;   
    DocumentoCony:      string;
    Conyuge:            string;   
    DesEstado:          string;
    TipoPago:           string;
    Banco:              string; 
    TipoCambio:         string| number;
    Valor:              string|number;
    ValorSeparacion:    number;
    lote:               string;
    //  VARIABLES DE LA TABLA  
    IdContrato:         number;
    IdManzana:          number;
    IdProyecto:         number;
    IdLote:             number;
    IdCliente:          number;
    IdVendedor:         number;
    IdConyuge:          number;
    IdReserva:          number;
    Codigo:             string;
    Descripcion:        string;
    FechaContrato:      number;
    TipoContrato:       number;
    MonedaCodigo:       string;
    Area:               number;
    TasaInteres:        number;
    Monto:                      number;
    Interes:                    number;
    CantidadLetra:              number;
    DiasGracia:                 number;
    ValorCuotaInicial:          number;
    FechaPrimeraLetra:          Date;
    ValorUltimaLetra:           number;
    FechaInicial:               Date;
    ComisionPorcentaje:         number;
    ComisionInicialPorcentaje:  number;
    ComisionTotal:              any;
    Estado:                     number;
    UsuarioCreacion:            string;
    UsuarioModificacion:        string;
    FechaCreacion:              Date;
    FechaModificacion:          Date;
    IpCreacion:                 string;
    IpModificacion:             string;
    ValorLetra:                 number;

    Observacion :               string;
    CuentaBancaria :            string;
    progreso:                   number;
    letrasVencidas?:            number;
    montoLetrasVencidas?:       number;
    desdeLetra?:                string;
    hastaLetra?:                string;
    FormaPago:                  string;
    IdComprobante:              number;
    TipoComprobante:            string;    
    SerieComprobante:           string;
    NumeroComprobante:          string;
    CampoReferencia:            string;
    PeriodoEmision:             string;	
    MontoAfecto:                number;
    ValorImpuesto:              number;
    MontoImpuestoVentas:        number;
    MontoTotal:                 number;
    FechaEmision:               Date;  
    FechaVencimiento:           Date;  
    MontoCambioReferencial?:     number;


}