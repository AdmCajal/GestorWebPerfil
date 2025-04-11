import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { DtoReserva } from "../model/DtoReserva";
import { FiltroReserva } from "../model/FiltroReserva";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})


export class ReservaService {

    private urlma = `${this.config.getEnv('proxy.precisa')}api/Venta/`;
    
    constructor(private config: AppConfig, private http:HttpClient) { }
  
    listarReserva(filtro: FiltroReserva): Promise<DtoReserva[]> {
      return this.config.getHttp().post(`${this.urlma}ListarReserva`, filtro)
        .toPromise()
        .then(response => response as DtoReserva[])
        .catch(error => error)
      }

 

      mantenimientoReserva(codigo: number, parametros: DtoReserva, token: string) {
      const headers = new HttpHeaders().set("Authorization", token)
      return this.config.getHttp().post(`${this.urlma}MantenimientoReserva/` + codigo, parametros, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
  }


//   public mantenimientoReserva(codigo: number, parametros: DtoReserva, token: string): Promise<DtoReserva> {
//     const headers = new HttpHeaders().set("Authorization", token)
//     return this.config.getHttp().post(`${this.urlma}MantenimientoReserva/` + codigo, parametros, { headers: headers })
//         .toPromise()
//         .then(response => response as DtoReserva)
//         .catch(error => null);
// }


}