import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { filtroUsuario } from '../model/filtro.usuario';
import { Usuario } from '../model/usuario';

@Injectable({
    providedIn: 'root'
})

export class UsuarioService {

    private urlma = `${this.config.getEnv('proxy.precisa')}api/Seguridad/`;
    constructor(private config: AppConfig, private http:HttpClient) { }
  
    listarUsuarioMast(filtro: filtroUsuario) {
    return this.config.getHttp().post(`${this.urlma}ListaUsuario`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    listarComboPerfil(filtro: any) {
        return this.config.getHttp().post(`${this.urlma}ListarComboPerfil`, filtro)
          .toPromise()
          .then(response => response)
          .catch(error => error)
        }

    ObtenerDesencriptar(filtro: any) {
          return this.config.getHttp().post(`${this.urlma}Desencriptar`, filtro)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    mantenimientoUsuarioMast(codigo: number, empleados: Usuario, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoUsuario/` + codigo, empleados, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }




}