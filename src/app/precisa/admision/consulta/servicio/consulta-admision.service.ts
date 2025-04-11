import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../../../environments/app.config';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { Admision, Cliente, ConsultaDetalleAdmision, Sede, TraerXAdmisionServicio } from '../dominio/dto/DtoConsultaAdmision';
import { FiltroCliente, FiltroConsultaAdmision, FiltroListarXAdmision, FiltroTipoOAdmision, FiltroTipoOperacion } from '../dominio/filtro/FiltroConsultaAdmision';
import { Observable } from 'rxjs';
import { DtoPacienteClinica } from '../../paciente-clinica/dominio/dto/DtoPacienteClinica';

@Injectable({
  providedIn: 'root'
})
export class ConsultaAdmisionService {
  //private url = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;

  private urladm = `${this.config.getEnv('proxy.precisa')}api/Admision/`;
  private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  private urlseg = `${this.config.getEnv('proxy.precisa')}api/Seguridad/`;
  private urlReporte = `${this.config.getEnv('proxy.reporte')}`;
  // private urlReporte = "https://precisa.pe/ServiciosRest/AppReporte/"
  constructor(private http: HttpClient, private config: AppConfig, private route: ActivatedRoute,) { }

  listarXadmision(xadmision: FiltroListarXAdmision) {
    return this.config.getHttp().post(`${this.urladm}TraerXAdmisionServicio`, xadmision)
      .toPromise()
      .then(response => response as TraerXAdmisionServicio[])
      .catch(error => error)
  }

  listarDetalleAdmision(filtro: FiltroConsultaAdmision) {
    return this.config.getHttp().post(`${this.urladm}ListadoAdmisionConstancia`, filtro)
      .toPromise()
      .then(response => response as ConsultaDetalleAdmision[])
      .catch(error => error)
  }

  listarpaginado(filtro: FiltroConsultaAdmision) {

    return this.config.getHttp().post(`${this.urladm}ListarAdmision`, filtro)
      .toPromise()
      .then(response => response as FiltroConsultaAdmision[])
      .catch(error => error)
  }

  listarcombocliente(cliente: FiltroCliente) {
    // return this.config.getHttp().post('/api/Admision/ListarTipoOperacionCliente', cliente)
    return this.config.getHttp().post(`${this.urladm}ListarTipoOperacionCliente`, cliente)
      .toPromise()
      .then(response => response as Cliente[])
      .catch(error => error)
  }

  listarcomboclientexcodigo(cliente: FiltroCliente) {
    // return this.config.getHttp().post('/api/Admision/ListarTipoOperacionCliente', cliente)
    return this.config.getHttp().post(`${this.urladm}ListaTipoOperacionxCodigo`, cliente)
      .toPromise()
      .then(response => response as Cliente[])
      .catch(error => error)
  }

  listarcombotipooperacion(operacion: FiltroTipoOperacion) {
    // return this.config.getHttp().post('/api/Admision/ListarTipoOperacion', operacion)
    return this.config.getHttp().post(`${this.urladm}ListarTipoOperacion`, operacion)
      .toPromise()
      .then(response => response as FiltroTipoOperacion[])
      .catch(error => error)
  }

  listarModeloServicio(operacion: FiltroTipoOperacion) {
    // const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urladm}ListarModeloServicio`, operacion)
        .toPromise()
        .then(response => response as FiltroTipoOperacion[])
        .catch(error => error)
  }

  listarcombotipoadmision(tipoadmin: FiltroTipoOAdmision) {
    tipoadmin.AdmEstado = 1;
    // return this.config.getHttp().post('/api/Maestro/ListaTipoAdmision', tipoadmin)
    return this.config.getHttp().post(`${this.urlma}ListaTipoAdmision`, tipoadmin)
      .toPromise()
      .then(response => response as FiltroTipoOAdmision[])
      .catch(error => error)
  }



  listarAdmisionSede(idEmpresa: number) {
    let IdEmpresa = { IdEmpresa: idEmpresa }
    // return this.config.getHttp().post('/api/Admision/ListaSede', IdEmpresa)
    return this.config.getHttp().post(`${this.urladm}ListaSede`, IdEmpresa)
      .toPromise()
      .then(response => response as Sede)
      .catch(error => error)
  }



  sendCorreo(parametros: any) {
    return this.config.getHttp().post(`${this.urlseg}EnviarCorreo/1`, parametros)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  printListadoReporte(payload: any): any {
    return this.config.getHttp().post(`${this.urladm}ListadoReporte`, payload)
      .toPromise()
      .then(response => response as any)
      .catch(error => error)
  }

  // getPrintReporteConstancia(payload: any): any {

  //   var mediaType = 'application/pdf';
  //   return this.config.getHttp().post(`${this.urladm}ListadoReporte`, payload, { responseType: 'blob' })
  //     .pipe(
  //       map((result: any) => {
  //         //var blob = new Blob([result], { type: mediaType });
  //         console.log("pdf result", result.);
  //         return result;
  //       })
  //     )
  // }

 

  getPrintConstaciaZenit(IdAdmision, NroPeticion) {

    return this.config.getHttp().get(`${this.urlReporte}CO_ReporteConstancia.aspx?IdAdmision=${IdAdmision}&NroPeticion=${NroPeticion}`)
      .toPromise()
      .then(response => response as any)
      .catch(error => error)
  }

  //soap
  getPrintReporteConstanciaSoap(IdAdmision, NroPeticion): any {
    const headers = new HttpHeaders()
      .append("SOAPAction", "http://tempuri.org/ListadoImpresion")
      .append('Content-Type', 'text/xml;charset=UTF-8')
    //      .append('Content-Length', 'length');

    var body = "<soapenv:Envelope  xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">\r\n" +
      "   <soapenv:Header/>\r\n" +
      "   <soapenv:Body>\r\n" +
      "      <tem:ListadoImpresion>\r\n" +
      "         <tem:ObjDetalle>\r\n" +
      "             <tem:IdReporte>" + 1 + "</tem:IdReporte>\r\n" +
      "             <tem:IdAdmision>" + IdAdmision + "</tem:IdAdmision>\r\n" +
      "             <tem:NroPeticion>" + NroPeticion + "</tem:NroPeticion>\r\n" +
      "         <tem:ObjDetalle>\r\n" +
      "      </tem:ListadoImpresion>\r\n" +
      "   </soapenv:Body>\r\n" +
      "</soapenv:Envelope>"

    console.log("heder:", headers);
    console.log("BODY aqui:", body);
    return this.config.getHttp().post(`${this.urlReporte}WServiceReporte.asmx?op=ListadoImpresion`, body, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }


}

