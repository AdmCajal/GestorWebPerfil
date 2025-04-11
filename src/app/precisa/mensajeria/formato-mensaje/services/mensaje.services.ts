import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { Dtomensaje } from "../model/Dtomensaje";
import { Filtromensaje } from "../model/Filtromensaje";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})


export class MensajeServices {

    private urlma = `${this.config.getEnv('proxy.precisa')}api/Mensajeria/`;
    
    constructor(private config: AppConfig, private http:HttpClient) { }
  
    ListarMensaje(filtro: Filtromensaje) {
      return this.config.getHttp().post(`${this.urlma}ListarMensaje`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

      MantenimientoMensaje(codigo: number, parametros: Dtomensaje, token: string) {
      const headers = new HttpHeaders().set("Authorization", token)
      console.log("MantenimientoMensaje", headers);
      return this.config.getHttp().post(`${this.urlma}MantenimientoMensaje/` + codigo, parametros, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
  }



}