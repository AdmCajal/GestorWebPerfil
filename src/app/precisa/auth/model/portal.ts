export class Portal{

    constructor(){
        this.Logo=''
        this.RutaImagen=''
        this.Direccion=''
        this.Telefono=''
        this.Correo=''
    }

    IdPortal: number;
    Logo: string;
    RutaImagen: string;
    Direccion: string;
    Telefono: string;
    Correo: string;
    Estado: number;
    FechaCreacion?: any;
    FechaModificacion: Date;
    UsuarioCreacion?: any;
    UsuarioModificacion: string;
    IpCreacion?: any;
    IpModificacion: string;
    ESTADOdesc: string;
}