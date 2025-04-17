import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    constructor(private _HttpClient: HttpClient) {
    }


    /**
     * Metodo que retorna api estandar para el proyecto
     * @returns url de api a consumir en general
     */
    public UrlApiPortal(): Promise<any> {
        return this._HttpClient.get<any>('assets/config/proxy.conf.json')
            .toPromise()
            .then(res => res.portalWeb as any)
            .then(data => data);
    }

    /**
     * @returns Estructura de configuración de imágenes
     */
    public imagenesConfig(): Promise<any> {
        return this._HttpClient.get<any>('./assets/config/images.conf.json')
            .toPromise()
            .then(res => res.imagenesPortal as any)
            .then(data => data);
    }

    /** 
     * @returns Estructura de configuración de colores
     */
    public coloresConfig(): Promise<any> {
        return this._HttpClient.get<any>('assets/config/colors.conf.json')
            .toPromise()
            .then(res => res.coloresPortal as any)
            .then(data => data);
    }
}
