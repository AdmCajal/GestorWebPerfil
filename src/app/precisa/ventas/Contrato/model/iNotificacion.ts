export class INotificacion {
    constructor() {
    }

//  VARIABLES DE INCORMPORADAS
    num:                number;
    Saldo:              number;
    IdContrato:              number;
    Dias:              number;

//  VARIABLES DE LA CONSULTA    
    CompaniaCodigo:     string;
    NomProyecto:        string;
    DescripcionCorta:   string;
    IdSede:             number;
    SedDescripcion:     string;
    NomManzana:         string; 
    DesCondicion:       string;
    Area:               number;
    Situacion:          number;
    DesUbicacion:       string;

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
    DesLote:               string;
    //  VARIABLES DE LA TABLA  

    IdManzana:          number;
    IdProyecto:         number;
    IdLote:             number;
    IdCliente:          number;
    IdVendedor:         number;
    IdConyuge:          number;
    IdReserva:          number;
    Codigo:             string;
    Descripcion:        string;
    FechaContrato:      Date;
    TipoContrato:       number;
    MonedaCodigo:       string;

    TasaInteres:        number;
    Monto:              number;
    Interes:            number;
    CantidadLetra:      number;
    CantidadLetraPendientePagadas:  number;
    Cuota:              number;
    FechaPrimeraLetra:  Date;
    CantidadLetraPendiente:     number;
    FechaInicio:                Date;
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
}