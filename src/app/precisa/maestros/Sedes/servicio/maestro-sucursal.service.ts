import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { DtoWcoSede } from '../dominio/dto/DtoWcoSede';
import { FiltroWcoSede } from '../dominio/filtro/FiltroWcoSede';

@Injectable({
  providedIn: 'root'
})
export class MaestroSucursalService {

  private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  constructor(private config: AppConfig, private http:HttpClient) { }

  ListaSede(filtro: FiltroWcoSede) {
    return this.config.getHttp().post(`${this.urlma}ListaSede`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    mantenimientoMaestro(codigo: number, dto: DtoWcoSede, token: string) {
      const headers = new HttpHeaders().set("Authorization", token)
      return this.config.getHttp().post(`${this.urlma}MantenimientoSede/` + codigo, dto, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
    }



}
