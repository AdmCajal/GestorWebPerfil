import { DominioPaginacion } from "../../../../framework/modelo/generico/DominioPaginacion";

export class ExamenConsultarOA {
    constructor(){
    }
    success: boolean;
    data: FiltroPacienteClinica = new FiltroPacienteClinica();
    tokem: string;
    mensaje: string;
    valor: number;

}



export class FiltroPacienteClinica {
    constructor(){
        this.paginacion = new DominioPaginacion();
    }
    
    ModeloServicioId: number;
    consentimiento: string;
    persona: number;
    Celular: number;
    Telefono: number;
    IdSedeEmpresa: number;
    comboCliente: number;
    IngresoFechaRegistro: Date;
    ApellidoMaterno: string;
    ApellidoPaterno: string;
    Nombres: string;
    ObservacionAlta: string;
    OrdenSinapa: string;
    paginacion: DominioPaginacion;
    TipoDocumento: string;
    Estado: number;
    TipoPacienteId: number;
    accion:string;
    CodigoComponente: string;
    TipoOrden: string;
    TipoOperacionID: number;
    Documento: string;
    NombreCompleto: string;
    CodigoHC: string;
    FechaNacimiento: Date;
    CorreoElectronico: string;
    Sexo: string;
    Edad: number;
    Comentario: string;
    ComentarioContrato: string;
    NroPeticion: string;
    OrdenAtencion: string;
    CMP: string;
    Busqueda: string;
    IdAseguradora: number;
    NombreEmpresa: string;
    DocumentoFiscal: string;
    empresa: number;
    ClasificadorMovimiento: string;
    IdSede: number;
    TipoOrdenAtencion: number;
    TipoOrdenAtencion2:string;
    TipoAtencion: number;
    IdListaBase: number;
    IdEspecialidad: number;
    Cama: string;
    CoaSeguro: string;
    MedicoId: number;
    Persona: number;
    CodigoOA:string;
    IdCliente:number;
    Sucursal:string;
    UneuNegocioId:number;
    TIPOADMISIONID:number;
    TipEstado:number;
    IdEmpresa:number;
    Compania:string;

}