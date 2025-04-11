import { DtoAdmisionclinicaDetalle } from "./DtoAdmisionclinicaDetalle";


export class DtoAdmisionprueba {

    // constructor() {
    //     this.IndicadorWS = null;
    //     this.Admision=new DtoPacienteClinica;
    //     this.list_AdmisionServicio=[];
    // }
    IndicadorWS:number;
    Admision:DtoPacienteClinica = new DtoPacienteClinica();
    list_AdmisionServicio:DtoAdmisionclinicaDetalle[] = []; 
}


export class DtoPacienteClinica {
    constructor() {
       // this.list_AdmisionServicio=[];
    }
    MosEstado: number;
    OrdenSinapa: string;
    EstadoAdm: string;
    Valor: number;
    Cantidad: number;
    Descripcion: string;
    IdAdmServicio: number;
    nombres: string;
    Documento: string;
    TipoOperacionID: number;
    FlatAprobacion: number;
    DesEstado: string;
    IdEspecialidad: number;
    IdAseguradora: number;
    IdEmpresaPaciente: number;
    MedicoId: number;
    Persona: number;
    IdAdmision: number;
    NroPeticion: string;
    numeroXadmision: number;
    CodigoComponente: string;
    ValorEmpresa: number;
    nrocorrBuscarOA:number;
    NombreCompleto:string;
    IdOrdenAtencion:number;
    Linea:number;
    Acceso:string;
    Servicio:string;
    Sucursal:string;
    CodigoHC:string;
    CodigoOA:string;
    TipoAtencion:number;
    TipoOrden:string;
    Cama:string;
    TipoDocumento:string;
    PacienteNombres:string;
    PacienteAPPaterno:string;
    PacienteAPMaterno:string;
   // FechaNacimiento:Date;
    Sexo:string;
    PacienteTelefono:number;
    Pacienteemail:string;
    Componente:string;
    ComponenteNombre:string;
    CantidadSolicitada:number;
    MedicoNombres:string;
    MedicoAPPaterno:string;
    MedicoAPMaterno:string;
    CMP:string;
    Especialidad_Nombre:string;
    Aseguradora_RUC:string;
    Aseguradora_Nombre:string;
    Empleadora_RUC:string;
    Empleadora_Nombre:string;
    FechaLimiteAtencion:Date;
    Observacion:string;
    Mensaje:string;
    Estado:number;
    UsuarioCreacion:string;
    UsuarioModificacion:string;
    FechaCreacion:Date;
    FechaModificacion:Date;
    IpCreacion:string;
    EstadoDocumento:number;
    SituacionInterfase:number;
    GrupoInterfase:number;
    FechaLimite:Date;
   // list_AdmisionServicio:DtoAdmisionclinicaDetalle[];

   // IndicadorWS:number=1;
  //COLUNA DTO

  fechanacimiento:Date;
  apellidopaterno:string;
  apellidomaterno:string;
  sexo:string;
  UneuNegocioId:number;
  TipoOperacionId:number;
  FechaAdmision:Date;
  HistoriaClinica:string;
  OrdenAtencion:string;
  IdSede:number;
  IpModificacion:string;
  TipoOrdenAtencion:number;
  RucEmpresaPaciente:string;
  EmpresaPaciente:string;
  RucAseguradora:string;
  NombreAseguradora:string;
  DesEspecialidad:string;
  CorreoElectronico:string;
  dniMedico:string;
  NombreMedico:string;
  PaternoMedico:string;
  MaternoMedico:string;
  TIPOADMISIONID:number;
  ClasificadorMovimiento:string;
  TipoPaciente:number;
  ObservacionAlta :string;
}