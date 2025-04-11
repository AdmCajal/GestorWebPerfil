export class DtoLote {
  constructor() {
  }
  IdProyecto: number;
  NomProyecto: string;
  CompaniaCodigo: string;
  NombreCompañia: string;
  DescripcionCorta: string;
  IdSede: number;
  SedDescripcion: string;
  DesCondicion: string;
  DesSituacion: string;
  DesUbicacion: string;
  NomManzana: string;
  Departamento: string;
  Provincia: string;
  Distrito: string;
  IdManzana: number;
  IdLote: number;
  Codigo: string;
  Nombre: string;
  Ubigeo: string;
  Direccion: string;
  Observacion: string;
  DescTipoLote: string;
  TipoLote: number;
  TipoInteres: number;
  DesTipoIntere: string;
  MorosidadPorcentaje: number;
  diasGracia: number;
  TipoCambio: number;
  MonedaCodigo: string;
  DesMoneda: string;
  AreaTotal: number;
  Valor: number;
  ValorTotal: number;
  Condicion: number;
  Situacion: number;
  Ubicacion: number;
  UsuarioCreacion: string;
  Estado: number;
  descEstado: string;
  UsuarioModificacion: string;
  FechaCreacion: Date;
  FechaModificacion: Date;
  IpCreacion: string;
  IpModificacion: string;
  DesEstado: string;
  FlaUnion: number;
  IdLotePadre: number;
  Archivos: IArchivos[];
  valorEnSoles: number;
  valorEnsolesTotal: number;
  DescUbigeo: string;
  checkregistro: boolean = false;

  // CODIGOS DE ANGULAR
  num: number;
  imaNombre1: string;
  imagen1: string;
  imaNombre2: string;
  imagen2: string;
  imaNombre3: string;
  imagen3: string;
  imaNombre4: string;
  imagen4: string;
}

export class IArchivos {
  nombreArchivos: string;
  archivoasociado: string;
}
