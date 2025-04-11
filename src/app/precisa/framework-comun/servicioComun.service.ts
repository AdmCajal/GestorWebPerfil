import { MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfig } from '../../../environments/app.config';
import { ObjetoTitulo } from '../../../util/ObjetoTitulo';

@Injectable()
export class ServicioComunService {

    
    private url = `${this.config.getEnv('spring-framework-comun-api')}spring/core/mamiscelaneosdetallecomun/`;
   
    constructor(private http: HttpClient, private config: AppConfig) { }
    private itemsSource = new Subject<ObjetoTitulo>();
    private bloqueoSource = new Subject<Boolean>();
    private breadSource = new Subject<MenuItem[]>();
    private breadSourceMovil = new Subject<MenuItem[]>();
    private breadIconSource = new Subject<MenuItem>();

    itemsHandler = this.itemsSource.asObservable();
    bloqueoHandler = this.bloqueoSource.asObservable();
    breadHandler = this.breadSource.asObservable();
    breadHandlerMovil = this.breadSourceMovil.asObservable();
    breadIconHandler = this.breadIconSource.asObservable();

    setItems(items: ObjetoTitulo) {
        this.itemsSource.next(items); 
    }   
    
    setBloqueo(bloqueo: boolean) {
        this.bloqueoSource.next(bloqueo); 
    }   

    setBread(bread: MenuItem[], breadMovil: MenuItem[]){
        this.breadSource.next(bread);
        this.breadSourceMovil.next(breadMovil);
    }

    setBreadIcon(icon: MenuItem){
        this.breadIconSource.next(icon);
    }

 

}

export function CONVERTIR_FOTO(d) {
    if (d === undefined || d == null || d === '') {
        d = 'assets/layout/images/user.png';
    } else {
        d = 'data:image/jpg;base64,' + d;
    }
    return d;
}