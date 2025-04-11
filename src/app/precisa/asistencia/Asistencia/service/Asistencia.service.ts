import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { map } from 'rxjs/operators';
import { FiltroAsistencia } from "../model/filtro.Asistencia";
import { DtoAsistencia } from "../model/DtoAsistencia";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  public userLocation: [number, number] | undefined;
  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }
  //private urlma = `${this.config.getEnv('proxy.getlocation')}api/Venta/`;
  private urlrrhh = `${this.config.getEnv('proxy.rrhh')}api/Usuario/`;
  private urlasi = `${this.config.getEnv('proxy.rrhh')}api/Asistencia/`; 
  private urlmae = `${this.config.getEnv('proxy.rrhh')}api/Maestro/`; 
  
  constructor(private config: AppConfig, private http: HttpClient) { }

  /*listarReserva(filtro: FiltroReserva): Promise<DtoReserva[]> {
    return this.config.getHttp().post(`${this.urlma}ListarReserva`, filtro)
      .toPromise()
      .then(response => response as DtoReserva[])
      .catch(error => error)
    }*/

  getuserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation)
        },
        (err) => {
          console.log("Error al obtener ubicación", err);
          reject();
        }
      )
    })
  }

  async getDistrictFromCoordinates(latitude: number, longitude: number): Promise<string> {
    // Aquí deberías llamar a la API de geolocalización inversa para obtener el distrito correspondiente a las coordenadas
    // Por ejemplo, utilizando la API de Google Maps:
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=${ConstanteUI.TIPO_BUSCAR_COORDENADA_DISTRITO}&key=${ConstanteUI.API_KEY_GOOGLE}`);
    const data = await response.json();
    //
    const district = data.plus_code.compound_code.substr(9);
    return district;
  }

  async getZoneFromCoordinates(latitude: number, longitude: number): Promise<string> {
    // Aquí deberías llamar a la API de geolocalización inversa para obtener el distrito correspondiente a las coordenadas
    // Por ejemplo, utilizando la API de Google Maps:
    /**
     * API KEY
     * https://maps.googleapis.com/maps/api/geocode/json?latlng=-12.0432,-77.0282&result_type=&key=AIzaSyA-0joSm6mgnhz6jumfxE0w8COsLsJPBYA
     */
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=${ConstanteUI.TIPO_BUSCAR_COORDENADA_ZONA}&key=${ConstanteUI.API_KEY_GOOGLE}`);
    const data = await response.json();
    //
    const district = data.plus_code.compound_code.substr(9);
    return district;
  }


  ListarProcesoPeriodo(filtro: any) {
    return this.config.getHttp().post(`${this.urlmae}ListarProcesoPeriodo`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  ListarAsistenciaPeriodo(filtro: any) {
    return this.config.getHttp().post(`${this.urlasi}ListarAsistenciaPeriodo`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  listarAsistencia(filtro: DtoAsistencia) {
    return this.config.getHttp().post(`${this.urlasi}ListarMarcacion`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  mantenimientoAsistencia(codigo: number, parametros: DtoAsistencia, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    // return this.config.getHttp().post(`${this.urlrrhh}SaveAsistencia/`, parametros, { headers: headers })
    return this.config.getHttp().post(`${this.urlrrhh}SaveAsistencia/`, parametros)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

}
