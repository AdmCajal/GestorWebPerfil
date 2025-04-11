export class DtoAsistencia{
    constructor() {
    }
    Empleado:           number;
    Secuencia:          number;
    FechaMarcacion:     Date;
    TipoMarcacion:      string;
    LugarMarcacion:     string;
    Latitud:            string;
    Longitud:           string;
    Estado:             string;
    UsuarioCreacion:    string;
    IpCreacion:         string;

    nombrecompleto:     string;
    companiasocio:      string;
    documento:          string;
    sucursal:           string;
    codigocarnet:       string;
    area_desc:          string;  
    num:                number;
    Horas:              string;
    FechaCreacion?:     Date;
    Comentarios?:       string;

    Periodo:            string;
}
