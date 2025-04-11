import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { nbAuthCreateToken } from '@nebular/auth';
import { AppConfig } from '../../../../../environments/app.config';
import { DominioPaginacion } from '../../../framework/modelo/generico/DominioPaginacion';
import { Admision, AdmisionServicio, TraerXAdmisionServicio } from '../../consulta/dominio/dto/DtoConsultaAdmision';
import { DtoAdmisionclinicaDetalle } from '../dominio/dto/DtoAdmisionclinicaDetalle'; import { DtoCombosPacienteCliini } from '../dominio/dto/DtoCombosPacienteCliini';
import { DtoAdmisionprueba, DtoPacienteClinica } from '../dominio/dto/DtoPacienteClinica';
import { ExamenConsultarOA, FiltroPacienteClinica } from '../dominio/filtro/FiltroPacienteClinica';

@Injectable({
    providedIn: 'root'
})
export class PacienteClinicaService {

    private url = `${this.config.getEnv('proxy.precisa')}api/WSSanna/`;
    private urlcombo = `${this.config.getEnv('proxy.precisa')}api/Admision/`;

    constructor(private config: AppConfig, private http: HttpClient) { }
    // listarpaginado() {
    //     var body = "<soap:Envelope  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n" +
    //         "   <soap:Body>\r\n" +
    //         "      <ConsultaOARest xmlns=\"http://tempuri.org/\">\r\n" +
    //         "           <IdCliente>" + 64 + "</IdCliente>\r\n" +
    //         "           <TipoOrdenAtencion>" + 5 + "</TipoOrdenAtencion>\r\n" +
    //         "           <Sucursal>" + "CSB" + "</Sucursal>\r\n" +
    //         "           <CodigoOA>" + "0002302987" + "</CodigoOA>\r\n" +
    //         "           <Documento>" + "" + "</Documento>\r\n" +
    //         "           <NombreCompleto>" + "" + "</NombreCompleto>\r\n" +
    //         "      </ConsultaOARest>\r\n" +
    //         "   </soap:Body>\r\n" +
    //         "</soap:Envelope>"
    //     console.log("BODY aqui:", body);
    //     return this.config.getHttp().post(this.url, body)
    //         .toPromise()
    //         .then(response => response)
    //         .catch(error => error)
    // }

    // const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' }; 
    // const body = { title: 'Angular POST Request Example' };


    listarConsultaOa() {

        const headers = new HttpHeaders()
            .append("SOAPAction", "http://tempuri.org/ConsultaOARest")
            .append('Content-Type', 'text/xml;charset=UTF-8')
            .append('Content-Length', 'length');

        // var body = "<soap:Envelope  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n" +
        //     "   <soap:Body>\r\n" +
        //     "      <ConsultaOARest xmlns=\"http://tempuri.org/\">\r\n" +
        //     "           <IdCliente>" + 64 + "</IdCliente>\r\n" +
        //     "           <TipoOrdenAtencion>" + 5 + "</TipoOrdenAtencion>\r\n" +
        //     "           <Sucursal>" + "CSB" + "</Sucursal>\r\n" +
        //     "           <CodigoOA>" + "0002302987" + "</CodigoOA>\r\n" +
        //     "           <Documento>" + "" + "</Documento>\r\n" +
        //     "           <NombreCompleto>" + "" + "</NombreCompleto>\r\n" +
        //     "      </ConsultaOARest>\r\n" +
        //     "   </soap:Body>\r\n" +
        //     "</soap:Envelope>"


        var body = "<soap:Envelope  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n" +
            "   <soap:Body>\r\n" +
            "      <ConsultaOAFerrer xmlns=\"http://tempuri.org/\">\r\n" +
            "           <TipoOrdenAtencion>" + 5 + "</TipoOrdenAtencion>\r\n" +
            "           <Sucursal>" + "CSF" + "</Sucursal>\r\n" +
            "           <CodigoOA>" + "1672294" + "</CodigoOA>\r\n" +
            "           <Documento>" + "" + "</Documento>\r\n" +
            "           <NombreCompleto>" + "" + "</NombreCompleto>\r\n" +
            "      </ConsultaOAFerrer>\r\n" +
            "   </soap:Body>\r\n" +
            "</soap:Envelope>"
        console.log("BODY aqui:", body);
        console.log("url:", this.url);
        console.log("heder:", headers);
        return this.config.getHttp().post(this.url, body, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    // header('content-type: application/jsonp; charset=utf-8');
    // header('Access-Control-Allow-Headers: Content-Type');
    // header('Access-Control-Allow-Methods: GET, POST');
    // header('Access-Control-Allow-Origin: *');
    // echo 'angular.callbacks._0('.json_encode

    public listarpaginado(filtro: FiltroPacienteClinica): Promise<any> {
        filtro.paginacion.paginacionListaResultado = null;
        return this.config.getHttp().post(this.url + 'ListarConsultaOA', filtro)
            .toPromise()
            .then(response => response as ExamenConsultarOA[])
            .catch(error => new ExamenConsultarOA());
    }
    // public listarpaginado(filtro: FiltroPacienteClinica): Promise<any> {
    //     filtro.paginacion.paginacionListaResultado = null;
    //     return this.config.getHttp().post(this.url + 'ListarConsultaOA', filtro)
    //         .toPromise()
    //         .then(response => response as DtoPacienteClinica[])
    //         .catch(error => new DtoPacienteClinica());
    // }



    listarComboCliente(filtro: FiltroPacienteClinica): Promise<any> {
        return this.config.getHttp().post(this.urlcombo + 'ListarTipoOperacionCliente', filtro)
            .toPromise()
            .then(response => response as any[])
            .catch(error => new DtoCombosPacienteCliini());
    }


    listarCombosedeCliente(filtro: FiltroPacienteClinica): Promise<any> {
        return this.config.getHttp().post(this.urlcombo + 'ListarSedeCliente', filtro)
            .toPromise()
            .then(response => response as any[])
            .catch(error => new DtoCombosPacienteCliini());
    }



    listarTipoPaciente(filtro: FiltroPacienteClinica): Promise<any> {
        return this.config.getHttp().post(this.urlcombo + 'ListarTipoOperacion', filtro)
            .toPromise()
            .then(response => response as any[])
            .catch(error => new DtoCombosPacienteCliini());
    }

    listarcomboTipoServicio(filtro: FiltroPacienteClinica): Promise<any> {
        return this.config.getHttp().post(this.urlcombo + 'ListaClasificadorMovimiento', filtro)
            .toPromise()
            .then(response => response as any[])
            .catch(error => new DtoCombosPacienteCliini());
    }

    // mantenimientoAdmision(codigo: number, Indicador: TraerXAdmisionServicio, token: string) {
    //     const headers = new HttpHeaders().set("Authorization", token)
    //     return this.config.getHttp().post('/api/Maestro/MantenimientoPersona/' + codigo, dtoPersona, { headers: headers })
    //     return this.config.getHttp().post(`${this.urlcombo}RegistrarAdmision/` + codigo, Indicador)
    //       .toPromise()
    //       .then(response => response)
    //       .catch(error => error)
    //   }

    mantenimientoAdmisionClinica(codigo: number, Admision: any, token: string) {
        // mantenimientoAdmisionClinica(codigo: number, Admision: DtoAdmisionprueba, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        console.log("REPITIENDO N VECES", headers)
        return this.config.getHttp().post(`${this.urlcombo}RegistrarAdmision/` + codigo, Admision, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)

    }

    cambioContratoTipoPaciente(codigo: number, Admision: DtoAdmisionprueba, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(this.urlcombo + 'CambioContratoTipoPaciente/' + codigo, Admision)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    anularAdmisionDetalle(codigo: number, lista: DtoPacienteClinica[], token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(this.urlcombo + 'AnularAdmisionDetalle/' + codigo, lista)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }





}
