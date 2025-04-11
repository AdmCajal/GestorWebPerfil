import { DominioPaginacion } from "../../../../framework/modelo/generico/DominioPaginacion";

export class dtoPersona {

    constructor() {
        this.paginacion = new DominioPaginacion();
    }

    IdAseguradora: number;
    IdPersona: number;
    TIPODOCUMENTO: string;
    ClasificadorMovimiento: string;
    SunatUbigeo: string;
    sunatubigeo: string;
    Persona: number;
    paginacion: DominioPaginacion;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    NombreCompleto: string;
    TipoDocumento: string;
    Documento: string;
    FechaNacimiento: Date;
    TipoPaciente: number;
    Sexo: string;
    Sexo2: string;
    Nacionalidad: string;
    EstadoCivil: string;
    Direccion: string;
    Telefono: string;
    CorreoElectronico: string;
    Nombres: string;
    Celular: string;
    TipoPersona: string;
    TipoPersonac: string;
    DEPARTAMENTO: string;
    departamento: string;
    PROVINCIA: string;
    provincia: string;
    IngresoFechaRegistro: Date;
    UltimaFechaModif: Date;
    IngresoUsuario: string;
    UltimoUsuario: string;
    PerPerfilProfesional: string;
    Estado: string;
    EsCliente: string;
    EsEmpleado: string;
    EsProveedor: string;
    EsOtro: string;
    DocumentoFiscal: string;
    Edad: number;
    Edad2: number;
    PerTipoVia: string;
    PasswordWeb: string;
    DireccionReferencia: string;
    Comentario: string;
    DiaVencimiento: number;
    IndicadorRetencion: string;
    esIndicadorRetencion: string;
    TotalUbigeo: string;
    PersonaAnt: string;
    CodigoHC: string;
    CodAsegurado: string;
    DesTipoPersona: string;
    DescUbigeo: String;
    ipUltimo: string;
    tipoPersonaC:string;

}