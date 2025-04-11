import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DtoClassProgramacion } from '../model/DtoClassProgramacion';
import { FiltroProgramacion } from '../model/FiltroProgramacion';

@Injectable({
  providedIn: 'root'
})
export class ProgramarMensajeService {


  private urlma = `${this.config.getEnv('proxy.precisa')}api/Mensajeria/`;

  constructor(private config: AppConfig, private http: HttpClient) { }

  enviarMensajeTexto(mensaje: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Rapidapi-Key': 'b2e727cfe0msh518b2162c071791p15e46fjsn407f848a8825',
        'X-Rapidapi-Host': 'textflow-sms-api.p.rapidapi.com',
        'Host': 'textflow-sms-api.p.rapidapi.com',
        'Content-Length': '27'
      })
    };

    return this.config.getHttp().post(`https://textflow-sms-api.p.rapidapi.com/send-sms`,mensaje, httpOptions)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }
  enviarMensajeCorreo(mensaje: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': '---'
      })
    };

    return this.config.getHttp().post(`https://api.sendgrid.com/v3/mail/send`,mensaje, httpOptions)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

    ListarMensajeProgramacion(filtro: FiltroProgramacion) {
    return this.config.getHttp().post(`${this.urlma}ListarMensajeProgramacion`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    ListarMensajeApp(filtro: any) {
      return this.config.getHttp().post(`${this.urlma}ListarMensajeApp`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

    MantenimientoProgramacion(codigo: number, parametros: DtoClassProgramacion, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoProgramacion/` + codigo, parametros, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
}

    ListarMensajeProgramacionDetalle(filtro: FiltroProgramacion) {
    return this.config.getHttp().post(`${this.urlma}ListarMensajeProgramacionDetalle`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

}
