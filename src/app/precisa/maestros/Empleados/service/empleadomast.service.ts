import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { EmpleadoMast } from '../model/empleadomast';
import { filtroEmpleadoMast } from '../model/filtro.empleadomast';


@Injectable({
    providedIn: 'root'
})

export class EmpleadoMastService {

    private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    private urloro = `${this.config.getEnv('proxy.orocom')}api/Pagina/ListaPaginaDetalle`;
    constructor(private config: AppConfig, private http:HttpClient) { }
  
    listarEmpleadoMast(filtro: filtroEmpleadoMast) {
    return this.config.getHttp().post(`${this.urlma}ListarEmpleadoMast`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }
    PRUEBA(filtro:any) {
    return this.config.getHttp().post(`${this.urloro}`, {IdPagina:2})
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    mantenimientoEmpleadoMast(codigo: number, empleados: EmpleadoMast, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoEmpleado/${codigo}`, empleados, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

}