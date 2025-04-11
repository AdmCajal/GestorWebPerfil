import { DominioPaginacion } from "../../../../framework/modelo/generico/DominioPaginacion";

export class Cliente {
    constructor() {
    }
    Persona: number;
    Documento: string;
    empresa: string;

}
export class TipoOperacion {
    constructor() {
    }

    TipoOperacionID: number;
    TIPOADMISIONID: number;
    Persona: number;
    TPContratoID: any;
    IdListaBase: number;
    UneuNegocioId: number;
    TPAplicaFactor: string;
    FechaCreacion: Date;
    FechaModificacion: Date;
    UsuarioCreacion: number;
    UsuarioModificacion: string
    IpCreacion: string;
    IpModificacion: string;
    TipEstado: number;
    TPFactor: any;
    TPMoneda: string
    AplicaFormula: number;
    TipoPacienteId: number;
    IdSede: number;
    Observacion: string;
    FlatAprobacion: string;
    FlaCon: number;
    FlagRedondeo: any;
    FlagArchivo: any;
    IdSedeCliente: any;
    FlagAdelanto: any;
    FlagCortesia: any;
    MontoMinimo: any;
    AdmDescripcion: string;
    empresa: string;
    Nombre: string;
    EstadoDesc: string;
    SedDescripcion: string;
    FechaInicio: Date;
    FechaTermino: Date;
    Moneda: any;
    CodigoContrato: any;
    Monto: any;
    Descripcion: string;
    DescripcionLocal: string;
    Codigo: number;
    Convenio: string;
    DesSedeCliente: any;

}
export class Admision {
    constructor() {
    }
    Telefono: number;
    Celular: number;
    Empresa: string;
    Busqueda: string;
    TipoOperacionID: number;
    TipoAdmisionId: number;
    NombreCompleto: string;
    CorreoElectronico: string;
    TipoDocumento: string;
    fechanacimiento: Date;
    Documento: string;
    nombres: string;
    apellidopaterno: string;
    apellidomaterno: string;
    sexo: string;
    IdAdmision: number;
    UneuNegocioId: number;
    TipoOperacionId: number;
    Persona: number;
    FechaAdmision: Date;
    HistoriaClinica: string;
    NroPeticion: string;
    OrdenAtencion: string;
    MedicoId: number;
    IdSede: number;
    Estado: number;
    FechaCreacion: Date;
    FechaModificacion: Date;
    UsuarioCreacion: string;
    UsuarioModificacion: string;
    IpCreacion: string;
    IpModificacion: string;
    MedicoDescripcion: string;
    IdEmpresaPaciente: number;
    IdAseguradora: number;
    TipoOrden: string;
    Cama: string;
    Grupo: string;
    IdSedeEmpresa: number;
    CoaSeguro: string;
    FechaLimite: Date;
    IdExamen: number;
    IdInsumo: number;
    ClasificadorMovimiento: string;
    IdAprobador: number;
    OrdenSinapa: string;
    ValorDescuento: number;
    FlatSeguro: string;
    FlatCoaSeguro: string;
    FlatMovilidad: string;
    Afecto: string;
    Igv: string;
    Total: string;
    Anticipo: string;
    Saldo: string;
    Redondeo: string;
    TipoPaciente: number;
    Especialidad: number;
    TipoOrdenAtencion: number;
    IdContrato: number;
    IdPoliza: number;
    IdPlan: number;
    ObservacionAlta: string;
    TipoAtencion: number;
    IdEspecialidad: number;
    TIPOADMISIONID: number;
}
export class AdmisionServicio {
    constructor() {

    }
    IdAdmServicio: number;
    IdAdmision: number;
    Linea: number;
    CodigoComponente: string;
    NroPeticion: string;
    NombreCompleto: string;
    Descripcion: string;
    Cantidad: number;
    TipoOperacionID: number;
    Persona: number;
    ClasificadorMovimiento: string;
    IdSede: number;
    TIPOADMISIONID: number;
    AplicaTitular: any;
    Valorprecio: number;
    Clasificador: string;
    Valor: number;
    ValorEmpresa: number;
    Estado: number;
    EstadoAdm: string;
    Copago: any;
    idempresa: any;
    IdTitularAutorizado?: any;
    IdListaBase: number;
    Sexo: string;
    CanTotal: number;
    Igv: number;
    ValorIgv: number;
    UsuarioCreacion: string;
    UsuarioModificacion: string;
    IpCreacion: string;
    IpModificacion: string;
    edad: number;
}

export class TraerXAdmisionServicio {
    constructor() {

    }

    IndicadorWS: number;
    Admision: Admision = new Admision();
    list_AdmisionServicio: AdmisionServicio[] = [];
}

export class ConsultaDetalleAdmision {
  
    CodigoAnalisis: string;
    Precio: number;
    DES: string;
    DescripcionProveedor: string;
    IdAdmision: number;
    Linea: number;
    CodigoComponente: string;
    UneuNegocioId: number;
    TipoOperacionId: number;
    Persona: number;
    FechaAdmision: Date;
    HistoriaClinica: string;
    NroPeticion: string;
    Descripcion: string;
    Cantidad: number;
    TipoOperacionID: number;
    MedicoId: number;
    IdSede: number;
    TIPOADMISIONID: number;
    Sexo: string;
    edad: number;
    Telefono: string;
    MEDICO: string;
    CLIENTE: string;
    PROCEDENCIA: string;
    EMPRESA: string;
    Usuario: string;
    CorreoElectronico: string;
    NombreEmpresa: string;
    OrdenAtencion: string;
    Clave: string;
    Documento: string;
    Estado: number;
    FechaCreacion: Date;
    FechaModificacion: Date;
    UsuarioCreacion: number;
    UsuarioModificacion: number;
    IpCreacion: string;
    IpModificacion: string;
    MedicoDescripcion: string;
    IdEmpresaPaciente: number;
    IdAseguradora: number;
    TipoOrden: string;
    Cama: string;
    Grupo: number;
    IdSedeEmpresa: number;
    CoaSeguro: string;
    FechaLimite: Date;
    IdExamen: number;
    IdInsumo: number;
    ClasificadorMovimiento: string;
    IdAprobador: number;
    OrdenSinapa: string;
    TipoPaciente: string;
    TipoAtencion: string;
    Portal: string;
    redondeo: number;
    ValorDescuento: number;
    FlatSeguro: string;
    FlatCoaSeguro: string;
    FlatMovilidad: string;
    Afecto: string;
    Igv: string;
    Total: string;
    Anticipo: string;
    Saldo: string;
    Redondeo: string;
    Tipo: string;
    DesEstado: string;
    TipoAdmisionId: number;
    NombreCompleto: string;
    DesExamen: number;
    DesInsumo: number;
    desCoaSeguro: number;
    desMovilidad: string;
    fechanacimiento: Date;
    nombres: string;
    apellidopaterno: string;
    apellidomaterno: string;
    sexo: string;
    igvprecioexamenes:number;
    ObservacionAlta: string;
}

export class Sede {
    IdSede: number;
    SedCodigo: string;
    SedDescripcion: string;
    // SedIp: null,
    SedEstado: number;
    // FechaCreacion: null,
    // FechaModificacion: null,
    // UsuarioCreacion: null,
    // UsuarioModificacion: null,
    // IpCreacion: null,
    // IpModificacion: null,
    // Inicial: null,
    // Final: null,
    // Fecha: null,
    // Val_Ini: null,
    IdEmpresa: number;
    FlatCodigo: number;
    // Direccion: null,
    Establecimiento: number;
    FlatImpresion: number;
    // CodTipoRoe: null,
    // CodEmpresaRoe: null,
    // ClasificadorMovimiento: null,
    // TipoAtencion: null,
    // TipoPaciente: null,
    // Ruta: null,
    // TipoOrden: null,
    DescEstado: string;
    // TipoAdmisionId: null,
    NombreCompleto: string;
    // CompaniaCodigo: null
}