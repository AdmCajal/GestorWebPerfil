import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { DtoEgreso } from "../model/dtoegreso";
import { DtoEgresoDetalle } from "../model/dtoegresodetalle";
import { DtoClassEgreso } from "../model/dtoclassegreso";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";




@Injectable({
    providedIn: 'root'
})


export class EgresoService {

    private urlma = `${this.config.getEnv('proxy.precisa')}api/Egreso/`;

    constructor(private config: AppConfig, private http: HttpClient) { }

    ListarEgreso(filtro: DtoEgreso) {
        return this.config.getHttp().post(`${this.urlma}ListarEgreso`, filtro)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }
    ListarEgresoDetalle(filtro: DtoEgresoDetalle|DtoEgreso) {
        return this.config.getHttp().post(`${this.urlma}ListarEgresoDetalle`, filtro)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    MantenimientoEgreso(codigo: number, parametros: DtoClassEgreso) {
        const token=ConstanteUI.TOKEN_USUARIO;
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoEgreso/${codigo}`, parametros, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }
    
    MantenimientoEgresoDetalle(codigo: number, parametros: DtoEgresoDetalle) {
        const token=ConstanteUI.TOKEN_USUARIO;
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoEgresoDetalle/${codigo}` , parametros, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }


}