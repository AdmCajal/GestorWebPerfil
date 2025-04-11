import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { DtoLote } from "../model/DtoLote";
import { FiltroLote } from "../model/FiltroLote";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})


export class LoteService {

    private urlma = `${this.config.getEnv('proxy.precisa')}api/Proyecto/`;
    
    constructor(private config: AppConfig, private http:HttpClient) { }
  
    listarLote(filtro: FiltroLote) {
      return this.config.getHttp().post(`${this.urlma}ListarLote`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

    mantenimientoLote(codigo: number, parametros: DtoLote, token: string) {
      const headers = new HttpHeaders().set("Authorization", token)
      return this.config.getHttp().post(`${this.urlma}MantenimientoLote/` + codigo, parametros, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
  }


  mantenimientoLoteSUB(codigo: number, parametros: DtoLote, token: string){
    const headers = new HttpHeaders().set("Authorization", token)
    return this.http.post(`${this.urlma}MantenimientoLote/` + codigo, parametros, { headers: headers }).pipe(
      map(response => {
        return response;
      }), err => {
       return err
   })
 }

}