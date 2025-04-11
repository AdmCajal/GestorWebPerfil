import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { DtoCorrelativo } from '../model/DtoCorrelativo';
import { FiltroCorrelativo } from '../model/FiltroCorrelativo';


@Injectable({
    providedIn: 'root'
})

export class CorrelativoService {

    private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    constructor(private config: AppConfig, private http:HttpClient) { }


    MantenimientoCorrelativos(codigo: number, parametros: DtoCorrelativo, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoCorrelativosMast/` + codigo, parametros, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }


    
    ListarCorrelativos(filtro: any) {
      return this.config.getHttp().post(`${this.urlma}ListarCorrelativosMast`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

}