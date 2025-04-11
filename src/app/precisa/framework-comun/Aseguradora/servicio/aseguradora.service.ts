import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { Filtroaseguradora } from '../../../maestros/Aseguradora/dominio/filtro/Filtroaseguradora';
import { dtoaseguradora } from '../dominio/dto/dtoaseguradora';

@Injectable({
  providedIn: 'root'
})
export class AseguradoraService {
  
    private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;

  //private url = `${this.config.getEnv('proxy.precisa')}api/Maestro/MantenimientoTablaMaestro`;

  constructor(private config: AppConfig, private http: HttpClient) { }


  mantenimientoMaestro(codigo: number, dtoasegura: dtoaseguradora, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    // return this.config.getHttp().post('/api/Maestro/MantenimientoAseguradora/' + codigo, dtoasegura, { headers: headers })
    return this.config.getHttp().post(`${this.urlma}MantenimientoAseguradora/` + codigo, dtoasegura, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  listarpaginado(filtro: any) {
    // return this.config.getHttp().post('/api/Maestro/ListaAseguradora', filtro)
    return this.config.getHttp().post(`${this.urlma}ListaAseguradora`, filtro)
      //  return this.config.getHttp().post(this.url + 'ListaAseguradora', filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }


}
