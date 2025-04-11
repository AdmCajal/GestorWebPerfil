
export class DtoCompaniamast  {
    constructor(){
    }

    // pk
    CompaniaCodigo : string;
    DescripcionCorta : string;
    DescripcionLarga : string;
    DireccionComun : string;
    DireccionAdicional : string;
    FechaFundacion : Date;
    Telefono1 : string;
    Telefono2 : string;
    Telefono3 : string;
    Fax1 : string;
    Fax2 : string;
    DocumentoFiscal : string;
   // documentofiscaldesc : string;
    PropietarioPorDefecto : string;
    DescripcionExtranjera : string;
    MonedaPorDefecto : string;
    TipoCompania : string;
    FactorRValidacion : string;
    AfectoIGVFlag : string;
    CreditoFiscalFactorFlag : string;
    CuentaProvisionSBSFlag : string;
    LogoFile : string;
    Persona : number;
    personadesc : string;
    personadoc:string;
    RepresentanteLegal : string;
    PaginaWeb : string;
    CertificadoInscripcion : string;
    AfectoRetencionIGVFlag : string;
    DetraccionCuentaBancaria : string;
    Estado : string;
    ESTADOdesc : string;
    UltimoUsuario : string;
    UltimaFechaModif : Date;
    RepresentanteLegalDocumento : string;
    UsuarioCreacion : string;
    FechaCreacion : Date;
    Grupo : string;
    RegimenLaboralRTPS : string;
    CIIU : string;
    Ubigeo: string;
    DescripcionPSF : string;
    CodigoAnterior : string;

    // columnas
    CodDep:number;
    CodPro:number;
    CodDis:number;
    RUC:string;
}
