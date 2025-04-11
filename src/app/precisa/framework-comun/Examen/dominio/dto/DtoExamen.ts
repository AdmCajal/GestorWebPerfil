
export class Examen {

    constructor() {
    }
    IdClasificacion: number;
    UneuNegocioId: number;
    ModeloServicioId: number;
    CodigoComponente: number;
    UsuarioCreacion: string;
    Descripcion: string;
    EstadoAdm: string;
    FechaCreacion: Date;
    UsuarioModificacion: any;
    FechaModificacion: Date;
    IpCreacion: any;
    IpModificacion: any;
    Cantidad: number;
    Estado: number;
    TipoOperacionID: number;
    IdListaBase: number;
    Persona: number;
    TIPOADMISIONID: number;
    TipoPacienteId: number;
    Sexo: string;
    ClasificadorMovimiento: string;
    Valor: number;
    ValorEmpresa: number;
    Nombre:string;
    Observacion: string;
    Compania: string;
    ConceptoGasto: string;
    CentroCosto: string;
    IdArea:  number;
    TiempoMuestra:  number;
    Abreviatura: string;
    ESTADOdesc: string;
    clasificacion: string;
    DesMovimiento: string;
}

export class ComboServicio{

    constructor(){
    }   
     ClasificadorMovimiento :  string;
     ClasificadorMovimientoGrupo :  string;
     Nombre :  string;
     Descripcion :  string;
     Estado : number;
     UsuarioCreacion :  string;
     FechaCreacion : Date;
     UsuarioModificacion :  string;
     FechaModificacion : Date;
     FlujodeCaja :  string;
     Compania :  string;
     Factor : number;
     Portal :  string;
     FlagFactura : any;
     ESTADOdesc :  string; 
}