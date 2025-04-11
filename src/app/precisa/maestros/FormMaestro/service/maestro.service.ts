import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { FiltroMaestro } from '../model/Filtro.Maestro';
import { Maestro } from '../model/maestro';



@Injectable({
    providedIn: 'root'
})
export class MaestroService {

    private url = `${this.config.getEnv('proxy.precisa')}api/Maestro/MantenimientoTablaMaestro`;
    private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    
    constructor(private config: AppConfig, private http:HttpClient) { }

    // listarMaestro(filtro: FiltroMaestro) {
    //     return this.config.getHttp().post('/api/Maestro/ListaTablasMaestras', filtro)
    //         .toPromise()
    //         .then(response => response)
    //         .catch(error => error)
    // }

    listarMaestro(filtro: FiltroMaestro) {
        return this.config.getHttp().post(`${this.urlma}ListaTablasMaestras`, filtro)
          .toPromise()
          .then(response => response)
          .catch(error => error)
        }


    mantenimientoMaestro(codigo:number, maestro: Maestro, token: string){
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post('/api/Maestro/MantenimientoTablaMaestro/'+ codigo, maestro,{headers: headers})
        .toPromise()
        .then(response => response)
        .catch(error => error)
    }

}