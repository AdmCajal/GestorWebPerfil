export class DtoEgreso {
    constructor() {
    }
    TipoComprobante:         string;
    num?:                 number;
//   VARIABLES DE LA CONSULTA   
    CompaniaCodigo?:      string;
    DescripcionCorta?:    string;
    IdSede?:              number;
    SedDescripcion?:      string;
    TipoDocumento?:       string;
    Documento?:           string;
    Empleado?:            string;
    DesEstado?:           string;

//   VARIABLES DE LA TABLA   
    IdEgreso?:            number;
    Codigo?:              string;
    FechaRegistro?:       Date;
    IdEmpleado?:          number;
    Descripcion?:         string;
    Cantidad?:            number;
    MontoAfecto?:         number;
    MontoImpuesto?:       number;
    MontoTotal?:          number;
    Estado?:              number;
    UsuarioCreacion?:     string;
    UsuarioModificacion?: string;
    FechaCreacion?:       Date;
    FechaModificacion?:   Date;
    IpCreacion?:          string;
    IpModificacion?:      string;
    Sucursal?:            string;
}