export class UsuarioAuth {
    success: boolean;
    data: User[];
    tokem: string;
    mensaje: string;
    encPass: string;
    encCon: string;
    valor: number;

}

export class User {
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Nombres: string;
    NombreCompleto: string;
    TipoDocumento: string;
    Documento: string;
    TipoAtencion: number;
    SedDescripcion: string;
    IdSede: number;
    IdEmpresa: number;
    tipoPaciente: number;
    ruta?: any;
    DIA: number;
    SedIp?: any;
    UneuNegocioId: number;
    ACCESO: string;
    SerieBV: string;
    SerieFA: string;
    Igv: number;
    TipoCambio: number;
    Usuario: string;
    UsuarioPerfil: string;
    Nombre: string;
    Clave: string;
    ExpirarPasswordFlag: string;
    FechaExpiracion: Date;
    UltimoLogin?: any;
    NumeroLoginsDisponible?: any;
    NumeroLoginsUsados?: any;
    UsuarioRed: string;
    SQLLogin?: any;
    SQLPassword?: any;
    Estado: string;
    UltimoUsuario: string;
    UltimaFechaModif: Date;
    Persona: number;
    TipoUsuario: number;
    ClasificadorMovimiento: string;
    ind_consulta: string;
    Responsable: string;
    correo_empresa: string;
    FlagAproLetra: number;
    FlagAproInteres: number;
    FlagAproContrato: number;
}