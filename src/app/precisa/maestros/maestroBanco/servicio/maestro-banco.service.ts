import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { DtoBanco } from '../dominio/dto/DtoBanco';
import { FiltroBanco } from '../dominio/filtro/FiltroBanco';

@Injectable({
  providedIn: 'root'
})
export class MaestroBancoService {

  private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;

  constructor(private config: AppConfig, private http:HttpClient) { }
  
  listarmaestroBancos(filtro: FiltroBanco) {
  return this.config.getHttp().post(`${this.urlma}ListarBanco`, filtro)
    .toPromise()
    .then(response => response)
    .catch(error => error)
  }

  mantenimientoMaestro(codigo: number, dto: DtoBanco, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoBanco/` + codigo, dto, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }



}
