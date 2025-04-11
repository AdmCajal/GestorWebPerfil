import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { FiltroPrograma } from "../model/FiltroPrograma";
import { DtoPrograma } from '../model/DtoPrograma';


@Injectable({
    providedIn: 'root'
})


export class ProgramaService {

    private urlma = `${this.config.getEnv('proxy.precisa')}api/Proyecto/`;
    
    constructor(private config: AppConfig, private http:HttpClient) { }
  
    listarPrograma(filtro: FiltroPrograma) {
      return this.config.getHttp().post(`${this.urlma}ListarProyecto`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }


    mantenimientoPrograma(codigo: number, parametros: DtoPrograma, token: string) {
      const headers = new HttpHeaders().set("Authorization", token)
      return this.config.getHttp().post(`${this.urlma}MantenimientoProyecto/` + codigo, parametros, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
  }


}