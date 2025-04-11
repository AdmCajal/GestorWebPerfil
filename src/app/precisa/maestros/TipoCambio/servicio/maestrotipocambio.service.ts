import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Filtrotipodecambio } from '../dominio/filtro/Filtrotipodecambio';
import { DtoTipocambiomast } from '../dominio/dto/DtoTipocambiomast';

@Injectable({
  providedIn: 'root'
})
export class MaestrotipocambioService {


  private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;

  constructor(private config: AppConfig, private http:HttpClient) { }
  
  // listarmaestroTipoCambio(filtro: Filtrotipodecambio) {
  // return this.config.getHttp().post(`${this.urlma}ListadoTipoCambio`, filtro)
  //   .toPromise()
  //   .then(response => response)
  //   .catch(error => error)
  // }

  
  listarmaestroTipoCambio(filtro: Filtrotipodecambio): Promise<DtoTipocambiomast[]> {
    return this.config.getHttp().post(`${this.urlma}ListadoTipoCambio`, filtro)
        .toPromise()
        .then(response => response as DtoTipocambiomast[])
        .catch(error => []);
  }

  mantenimientoMaestro(codigo: number, dto: DtoTipocambiomast, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoTipoCambio/` + codigo, dto, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

}
