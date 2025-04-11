import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { DtoManzana } from '../model/DtoManzana';
import { FiltroManzana } from '../model/FiltroManzana'



@Injectable({
    providedIn: 'root'
})

export class ManzanaService {

    private urlma = `${this.config.getEnv('proxy.precisa')}api/Proyecto/`;
    constructor(private config: AppConfig, private http:HttpClient) { }


    
    listarManzana(filtro: FiltroManzana) {
      return this.config.getHttp().post(`${this.urlma}ListarManzana`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
    }

    mantenimientoManzana(codigo: number, parametros: DtoManzana, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoManzana/` + codigo, parametros, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }
  

}