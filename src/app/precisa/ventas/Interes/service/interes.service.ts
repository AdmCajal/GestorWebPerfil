import { DtoInteres } from './../model/Dtointeres';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})


export class InteresService {

  private urlma = `${this.config.getEnv('proxy.precisa')}api/Venta/`;

  constructor(private config: AppConfig, private http: HttpClient) { }

  ListarInteresFacturacion(filtro: DtoInteres) {
    return this.config.getHttp().post(`${this.urlma}ListarInteresComprobante`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ListarInteres(filtro: DtoInteres) {
    return this.config.getHttp().post(`${this.urlma}ListarInteres`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ListarLetraInteres(filtro: any) {
    return this.config.getHttp().post(`${this.urlma}ListarLetraInteres`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ListarInteresPadre(filtro: DtoInteres) {
    return this.config.getHttp().post(`${this.urlma}ListarInteresPadre`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  MantenimientoInteres(codigo: number, parametros: DtoInteres, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoInteres/${codigo}`, parametros, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }



}
