import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { DtoCuentaBancaria } from '../model/DtoCuentaBancaria';
import { FiltroCuentaBancaria } from '../model/FiltroCuentaBancaria';



@Injectable({
    providedIn: 'root'
})

export class CuentaBancariaService {

    private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    constructor(private config: AppConfig, private http:HttpClient) { }

    mantenimientoCuentaBancaria(codigo: number, parametros: DtoCuentaBancaria, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoCuentaBancaria/` + codigo, parametros, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }


    
    listarCuentaBancaria(filtro: FiltroCuentaBancaria) {
      return this.config.getHttp().post(`${this.urlma}listarCuentaBancaria`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

}