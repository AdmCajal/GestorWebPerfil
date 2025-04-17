import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class EncryptService {
    private miPrimeraChamba: string = "bO14efXtJrU7ySY2qjyQ6jvz63mQ8H/sPWTdIbXL1QAAiU4p5S0prjpEwLvO";

    constructor() { }

    public Encriptar(datos: any): any {
        const contenidoEncriptado = CryptoJS.AES.encrypt(datos, this.miPrimeraChamba).toString();
        return contenidoEncriptado;
    }

    public Desencriptar(datosEncriptados: any): any {
        const contenidoDesencriptado = CryptoJS.AES.decrypt(datosEncriptados, this.miPrimeraChamba).toString(CryptoJS.enc.Utf8);
        return contenidoDesencriptado;
    }
}
