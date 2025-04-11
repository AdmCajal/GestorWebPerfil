import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { DtoCompaniamast } from '../dominio/dto/DtoCompaniamast';
import { Image } from '../dominio/dto/image';
import { FiltroCompaniamast } from '../dominio/filtro/FiltroCompaniamast';

@Injectable({
  providedIn: 'root'
})
export class MaestrocompaniaMastService {

  private urlse = `${this.config.getEnv('proxy.precisa')}api/Seguridad/`;

  constructor(private config: AppConfig, private http: HttpClient) { }
  listarCompaniaMast(filtro: FiltroCompaniamast) {
    return this.config.getHttp().post(`${this.urlse}ListarCompania`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  mantenimientoMaestro(codigo: number, dto: DtoCompaniamast, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlse}MantenimientoCompania/` + codigo, dto, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  Mantenimientofile(codigo: number, dto: any, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlse}Mantenimientofile/` + codigo, dto, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  MantenimientoFileVer(filtroImg: Image, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlse}ListarTablaMaestroArchivo`, filtroImg, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }


  ListarTablaMaestroArchivo(dto: any) {
    return this.config.getHttp().post(`${this.urlse}ListarTablaMaestroArchivo`, dto)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

}
