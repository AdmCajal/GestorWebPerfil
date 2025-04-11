import { TreeNode } from "primeng/api";

export class PerfilUsuiario{

    constructor(){
        this.id=""
        this.UltimoUsuario=""
        this.tipousuario=""
        this.Perfil=""
        this.perfiles=[]
        this.estado=""
        this.VaEstado=""
    }
    id?: string;
    UltimoUsuario?: string;
    tipousuario?:any
    Perfil?: string;
    VaEstado?: string;
    estado?:string
    perfiles?:string[]
}