import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { map } from 'rxjs/operators';
import { FiltroContrato } from '../model/FiltroContrato';
import { DtoContrato } from '../model/DtoContrato';
import { DtoClassContrato } from '../model/DtoClassContrato';
import { ImprimirLetra } from "../model/imprimirletra";
import { DtoLetra } from "../../Control/model/dtoLetra";

@Injectable({
  providedIn: 'root'
})


export class ContratoService {

  private urlventa = `${this.config.getEnv('proxy.precisa')}api/Venta/`;

  constructor(private config: AppConfig, private http: HttpClient) { }



  ListarContrato(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ListarContrato`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  
  ListarContratoRequerimiento(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ListarContratoRequerimiento`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }
  

  ListarContratoSeguimiento(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ListarContratoSeguimiento`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }


  MantenimientoContrato(codigo: number, parametros: DtoClassContrato, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlventa}MantenimientoContrato/` + codigo, parametros, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ListarLetraImpresion(_idContrato:number) {
    let imprimirLetra:ImprimirLetra = new ImprimirLetra();
    imprimirLetra.valor = _idContrato;
    return this.config.getHttp().post(`${this.urlventa}ListarLetraImpresion`, imprimirLetra)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ReporteEstadoCuenta(_idContrato:number) {
    let imprimirLetra:ImprimirLetra = new ImprimirLetra();
    imprimirLetra.valor = _idContrato;
    return this.config.getHttp().post(`${this.urlventa}ReporteEstadoCuenta`, imprimirLetra)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ListarComision(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ListarComision`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }


  ListarLotesxComisionista(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ListarLotesxComisionista`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }
  
  ReporteLetraComprobante(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ReporteLetraComprobante`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ReporteContratoAtrasados(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ReporteContratoAtrasados`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ReporteLetraAtrasadas(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ReporteLetraAtrasadas`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  } 

  ReporteMensual(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ReporteMensual`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  } 

  ReporteIngresoMensual(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ReporteIngresoMensual`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  } 

  ReporteEstadisticoCantidad(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ReporteEstadisticoCantidad`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ReporteEstadisticoMonto(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ReporteEstadisticoMonto`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ListarLetraNotificacion(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ListarLetraNotificacion`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ListarLetraRequerimiento(filtro: FiltroContrato) {
    return this.config.getHttp().post(`${this.urlventa}ListarLetraRequerimiento`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

}