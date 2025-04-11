import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { FiltroControl } from "../model/filtroControl";
import { DtoControl } from "../model/Dtocontrol";
import { DtoClassComprobante } from "../model/DtoClassComprobante";
import { DtoContrato } from "../../Contrato/model/DtoContrato";


@Injectable({
    providedIn: 'root'
})

export class ControlService {

    private urlma = `${this.config.getEnv('proxy.precisa')}api/Venta/`;
    private urlfa = `${this.config.getEnv('proxy.precisa')}api/Facturacion/`;
    constructor(private config: AppConfig, private http:HttpClient) { }
  
    ListarLetraFacturacion(filtro: any) {
      return this.config.getHttp().post(`${this.urlma}ListarLetraFacturacion`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

    ListarLetra(filtro: FiltroControl) {
      return this.config.getHttp().post(`${this.urlma}ListarLetra`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

  MantenimientoLetra(codigo: number, parametros: DtoControl, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoLetra/` + codigo, parametros, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

  MantenimientoDividirLetra(codigo: number, parametros: any, token: string) {
      const headers = new HttpHeaders().set("Authorization", token)
      return this.config.getHttp().post(`${this.urlma}MantenimientoDividirLetra/` + codigo, parametros, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
    }

  MantenimientoFacturacion(codigo: number, parametros: DtoClassComprobante, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoFacturacion/` + codigo, parametros, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }
  

  MantenimientoFacturador(codigo: number, parametros: any, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlfa}MantenimientoFacturador/` + codigo, parametros, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }
  
  ListarComprobanteReporte(filtro: any) {
    return this.config.getHttp().post(`${this.urlma}ListarComprobanteReporte`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }


  ListarFacturacion(filtro: DtoContrato) {
    return this.config.getHttp().post(`${this.urlma}ListarFacturacion`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    ListarFacturacionDetalle(filtro: DtoContrato) {
      return this.config.getHttp().post(`${this.urlma}ListarFacturacionDetalle`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

}