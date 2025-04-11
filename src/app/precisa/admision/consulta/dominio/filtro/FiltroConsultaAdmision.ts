export class FiltroConsultaAdmision {
    constructor() {
    }

    FlatAprobacion: number;
    DesEstado: string;
    TipoAtencion: number;
    IdEspecialidad: number;
    TipoOrden: string;
    IdAseguradora: number;
    IdEmpresaPaciente: number;
    IpCreacion: string;
    UsuarioCreacion: string;
    MedicoId: number
    TipoOperacionId: number;
    TIPOADMISIONID: number;
    CorreoElectronico: string;
    sexo: string;
    apellidomaterno: string;
    apellidopaterno: string;
    nombres: string;
    fechanacimiento: Date;
    TipoDocumento: string;
    NroPeticion: string;
    Persona: number;
    ClasificadorMovimiento: string;
    HistoriaClinica: string;
    NombreCompleto: string;
    TipoAdmisionId: number;
    Documento: string;
    OrdenAtencion: string;
    FechaAdmision: Date;
    FechaCreacion: Date;
    IdSede: number;
    Estado: number;
    IdAdmision: number;

}
export class FiltroListarXAdmision {
    constructor() {
    }
    IdAdmision: number;
}

export class FiltroCliente {
    constructor() {
    }
    MosEstado: number
    TipoOperacionID: number;
    UneuNegocioId: number;
    TIPOADMISIONID: number;
    TipEstado: number;
    IdSede: number;
    Codigo: string;
    Nombre: string;

}
export class FiltroTipoOperacion {
    constructor() {
    }
    MosEstado: number;
    TipoPacienteId: number;
    UneuNegocioId: number;
    TIPOADMISIONID: number;
    TipEstado: number;
    IdSede: number;
    Persona: number;
    TipoOperacionID: number;
    CodigoContrato: string;
    //Codigo: string;
    //Nombre: string;
}

export class FiltroTipoOAdmision {
    constructor() {
    }
    AdmEstado: number;
}