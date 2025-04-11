import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../environments/app.config';

@Injectable({
    providedIn: 'root'
}
)
export class NodeService {
    private urlseg = `${this.config.getEnv('proxy.precisa')}api/Seguridad/`;
    private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    constructor(private http: HttpClient,private config: AppConfig) { }

    getFiles() {
        return this.http.get<any>('assets/archivo.json')
            .toPromise()
            .then(res => <TreeNode[]>res.data);
    }

   
    listarFiles(ObjRuta: any): Promise<any> {
            return this.config.getHttp().post(`${this.urlseg}ListarDirectorio`, ObjRuta)
                .toPromise()
                .then(response => response as any)
                .catch(error => error);          
    }
 


    sendPost(body:FormData):Observable<any>{
        return this.http.post(`${this.urlma}mantenimientoFile`,body)
    }

    mantenimientoArchivo(codigo: number, dtoFile: any, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
           return this.config.getHttp().post(`${this.urlma}mantenimientoArchivo/` + codigo, dtoFile, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
      }

}