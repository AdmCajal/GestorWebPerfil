import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { DtoTabla } from '../../../../../util/DtoTabla';
import { FiltroTipoOperacion } from '../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision';
import { FiltroExamen, FiltroServicio } from '../dominio/filtro/FiltroExamen';
import { Examen } from '../dominio/dto/DtoExamen';



@Injectable({
    providedIn: 'root'
  })
export class ExamenService {
    //private url = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;    
    constructor(private http: HttpClient, private config: AppConfig) { }   
    private urladm = `${this.config.getEnv('proxy.precisa')}api/Admision/`;  
  

    serviciopaginado(servicio: FiltroServicio) {
        // return this.config.getHttp().post('/api/Admision/ListaClasificadorMovimiento', servicio) 
        return this.config.getHttp().post(`${this.urladm}ListaClasificadorMovimiento`, servicio)        
            .toPromise()
            .then(response => response as DtoTabla[])
            .catch(error => error)
    }

    examenpaginado(examen: FiltroExamen) {   
        // return this.config.getHttp().post('/api/Admision/ListaComponente', examen)  
        return this.config.getHttp().post(`${this.urladm}ListaComponente`, examen)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    listarModeloServicio(filtro: FiltroTipoOperacion) {        
        return this.config.getHttp().post(`${this.urladm}ListarModeloServicio`, filtro)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    listarclasificadorcomponente(filtro: any) {   
        // return this.config.getHttp().post('/api/Admision/ListaComponente', examen)  
        return this.config.getHttp().post(`${this.urladm}ListarClasificadorComponente`, filtro)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    } 
    
    listarexamenmaestro(examen: FiltroExamen) {   
        // return this.config.getHttp().post('/api/Admision/ListaComponente', examen)  
        return this.config.getHttp().post(`${this.urladm}ListadoComponenteMaestro`, examen)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    mantenimientomaestro(codigo: number, dtoexamen: Examen, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        // return this.config.getHttp().post('/api/Maestro/MantenimientoAseguradora/' + codigo, dtoasegura, { headers: headers })
        return this.config.getHttp().post(`${this.urladm}MantenimientoComponente/` + codigo, dtoexamen, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
      }

}

