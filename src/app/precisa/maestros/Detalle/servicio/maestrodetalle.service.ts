import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Filtromaestrodetalle } from '../dominio/filtro/Filtromaestrodetalle';
import { Dtomaestrodetalle } from '../dominio/dto/Dtomaestrodetalle';

@Injectable({
  providedIn: 'root'
})
export class MaestrodetalleService {

  private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;

  constructor(private config: AppConfig, private http:HttpClient) { }
  
  listarmaestroDetalle(filtro: Filtromaestrodetalle) {
  return this.config.getHttp().post(`${this.urlma}ListaMaestroDetalle`, filtro)
    .toPromise()
    .then(response => response)
    .catch(error => error)
  }

    mantenimientoMaestro(codigo: number, dto: Dtomaestrodetalle, token: string) {
      const headers = new HttpHeaders().set("Authorization", token)
      return this.config.getHttp().post(`${this.urlma}MantenimientoMaestroDetalle/` + codigo, dto, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
    }


}
