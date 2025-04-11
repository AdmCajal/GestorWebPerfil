import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../environments/app.config';


@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private urlseg = `${this.config.getEnv('proxy.precisa')}api/Seguridad/`; 
    private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    private urlpo = `${this.config.getEnv('proxy.portal')}`;   
    private urlpa = `${this.config.getEnv('proxy.precisa')}api/Pagina/`;
     constructor(private config: AppConfig, private http: HttpClient) { }

    //ng serve --proxy-config src/assets/config/proxy.conf.json

    prueba() {
        const resultado = {
            CompaniaSocio: "00000100",
            FechaInicio: "2021-05-28",
            FechaFin: "2021-05-28"
        }

        return this.config.getHttp().post('/api/Items', resultado)
            .toPromise()
            .then(response => response)
            .catch(err => console.log(err))

    }

    login(usuario: any) {
        // const headers = new HttpHeaders()
        //     .append('Content-Type', 'application/json')
        //     .append('Access-Control-Allow-Headers', 'Content-Type')
        //     .append('Access-Control-Allow-Credentials', 'true')
        //     .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        //     .append('Access-Control-Allow-Origin', '*');;
        return this.config.getHttp().post(`${this.urlseg}ListaLogin`, usuario)
            .toPromise()
            .then(response => response)
            .catch(error => null);
    }

    login2(usuario: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': 'https://precisa.pe',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Credentials': 'true'
                //Authorization: 'my-auth-token'

            })
        };
        console.log("::::::httpOptions::::", httpOptions);
        console.log("")
        // return this.config.getHttp().post('/api/Admision/ListaLogin', usuario)
            return this.config.getHttp().post(`${this.urlseg}ListaLogin`, usuario, httpOptions)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    usuarioAuth(): any {
        let resultado = null
        resultado = JSON.parse(sessionStorage.getItem('access_user'))
        if (resultado != null) {
            resultado = resultado.success ? resultado.success : false
        } else {
            resultado = false
        }
        return resultado
    }

    usuarioGetToken(): any {
        let resultado = null
        resultado = JSON.parse(sessionStorage.getItem('access_user_token'))
        return resultado
    }

    listarPortal(portal: any): Promise<any> {
        console.log('/api/Seguridad/ListaPortal')
        // return this.config.getHttp().post('/api/Seguridad/ListaPortal', portal)
        return this.config.getHttp().post(`${this.urlseg}ListaPortal`, portal)
            .toPromise()
            .then(response => response as any)
            .catch(error => error);
    }

    ListaMenu(portal: any) {
        return this.config.getHttp().post(`${this.urlpa}ListaMenu`,portal)
        .toPromise()
        .then(response => response as any)
        .catch(error => error);
    }
    
    Listadetpagina(portal: any) {
        return this.config.getHttp().post(`${this.urlpa}detpagina`,portal)
        .toPromise()
        .then(response => response as any)
        .catch(error => error);
   }

    ListaPagina(portal: any) {
        return this.config.getHttp().post(`${this.urlpo}pagina`,portal)
        .toPromise()
        .then(response => response as any)
        .catch(error => error);
    }

    
    listarSedes(sede: any): Promise<any> {        
        // return this.config.getHttp().post('/api/Maestro/ListaSede', sede)
        return this.config.getHttp().post(`${this.urlma}ListaSede`, sede)
            .toPromise()
            .then(response => response as any)
            .catch(error => error);
    }



    listarMiscelaneos(miscelaneos: any): Promise<any> {
        // return this.config.getHttp().post('/api/Maestro/ListaTablaMaestroDetalle', miscelaneos)
        return this.config.getHttp().post(`${this.urlma}ListaTablaMaestroDetalle`, miscelaneos)
            .toPromise()
            .then(response => response as any)
            .catch(error => error);
    }

    listarMenu(usuario: any, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        // return this.config.getHttp().post('/api/Seguridad/ListarMenu', usuario, { headers: headers })
        return this.config.getHttp().post(`${this.urlseg}ListarMenu`, usuario, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    mostrarIp(ip: any) {        
        return this.config.getHttp().post(`${this.urlseg}ObtenerIP`, ip)
          .toPromise()
          .then(response => response)
          .catch(error => error)
      }

      listarEspecialidad(especialidad: any) {
        return this.config.getHttp().post(`${this.urlma}ListaEspecialidad`, especialidad)
          .toPromise()
          .then(response => response)
          .catch(error => error)
      }
  


}