export class Usuario{

    constructor(){
        
    }

    USUARIO:                string;
    TipoDocumento:          string;
    NOMBRECOMPLETO:         string;
    PERFIL:                 string;
    ESTADO:                 string;
    DesEstado:              string;
    ClasificadorMovimiento: string;
    Clave:                  string;
    ClaveNueva:             string;
    ExpirarPasswordFlag:    string;
    CorreoElectronico:      string;
    DesTipoUsuario:         string;
    TipoUsuario:            number;
    FechaExpiracion:        Date;
    UltimoUsuario:          string;
    UltimaFechaModif:       Date;
    PERSONA:                number;
    UsuarioCreacion?:       string;
    FechaCreacion?:         Date;
    FlagLetra:              boolean;
    FlagInteres:            boolean;
    FlagContrato:            boolean;

    FlagAproLetra:          number;
    FlagAproInteres:        number;
    FlagAproContrato:       number;
}