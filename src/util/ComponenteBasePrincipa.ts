import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition } from "@nebular/theme";
import { ConstanteUI } from "./Constantes/Constantes";
import { DtoMenu } from "./DtoMenu";
import { ObjetoTitulo } from "./ObjetoTitulo";
import { UIMantenimientoController } from "./UIMantenimientoController";
import { MessageService, SelectItem, Message, ConfirmationService } from 'primeng/api';
import { Subject, Subscriber } from 'rxjs';
import { MensajeController } from "./MensajeController";
import { UsuarioAuth } from "../app/precisa/auth/model/usuario";
import { Miscelaneos } from "../app/precisa/auth/model/miscelaneos";
import { ServicioComunService } from "../app/precisa/framework-comun/servicioComun.service";
import { convertDateStringsToDates } from "../app/precisa/framework/funciones/dateutils";
import { ConstanteAngular } from "../app/@theme/ConstanteAngular";
import Swal, { SweetAlertIcon } from "sweetalert2";
import { Router } from "@angular/router";
import { LoginService } from "../app/precisa/auth/service/login.service";
import * as CryptoJS from 'crypto-js';
import { AppConfig } from "../environments/app.config";
import { Parametros } from "../app/precisa/maestros/Parametros/model/parametros";
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');
export const enum accionesGlobal {
    NADA, NUEVO, EDITAR, VER, ELIMINAR, ANULAR, LISTAR
}

export function DestroySubscribers() {
    return function (target: any) {
        // decorating the function ngOnDestroy
        target.prototype.ngOnDestroy = ngOnDestroyDecorator(target.prototype.ngOnDestroy);
        // decorator function
        function ngOnDestroyDecorator(f) {
            return function () {
                // saving the result of ngOnDestroy performance to the variable superData
                const superData = f ? f.apply(this, arguments) : null;
                // unsubscribing
                for (const subscriberKey in this.subscribers) {
                    const subscriber = this.subscribers[subscriberKey];
                    if (subscriber instanceof Subscriber) {
                        subscriber.unsubscribe();
                    }
                }
                // returning the result of ngOnDestroy performance
                return superData;
            };
        }
        // returning the decorated class
        return target;
    };
}


export class ComponenteBasePrincipal {

    segundos: number = 30;
    IdTimer: any;
    // _loginService: LoginService


    imgRuta: any;
    timeoutId;
    userInactive: Subject<any> = new Subject();

    blocked: boolean = false;
    languaje: string;//Idioma de la web
    es: any;//Idioma del p-calendar (Español)
    private bloqueoSource = new Subject<Boolean>();

    servicioComun: ServicioComunService;
    accion: accionesGlobal;
    objetoTitulo: ObjetoTitulo = new ObjetoTitulo();
    menuSeguridad: DtoMenu = new DtoMenu();
    bean: any
    KeyAlfanumerico: RegExp = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\d\-_\s]+$/;
    KeyAlfanumericoSpecial: RegExp = /^[a-zA-Z0-9\P-\_\,\;\.;/,;´.\-°\ áéíóúÁÉÍÓÚñ/]*$/;
    keySoloLetras: RegExp = /^[a-zA-Z ]*$/;;
    noSpecial: RegExp = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\d\-,;/_\s]+$/;
    puedeEditar: boolean = false
    notUndefined: any = anyValue => typeof anyValue !== 'undefined' && anyValue != null
    dialog: boolean = false
    status: NbComponentStatus = 'success';
    usuarioAuth: UsuarioAuth = new UsuarioAuth();
    lstmiscelaneos: Miscelaneos[];
    lstparametros: Parametros[];
    //ARMAS: Control de mensajes entre componente
    mensajeController: MensajeController;
    // router: Router;
    // confirmationService: ConfirmationService;
    //Inicializar

    // constructor(
    //  ) {
    //     this.init();
    // }



    init() {
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],


            today: 'Hoy',
            clear: 'Limpiar',
            dateFormat: 'dd/mm/yy',
            weekHeader: 'Sem'


        };
        window.onbeforeunload = null;
        this.languaje = localStorage.getItem('lang');
    }

    // imgService(imgSer) {
    //     this.imgRuta = `${imgSer.getEnv('proxy.ruta')}`;
    // }

    validarCorreo(email: string): boolean {
        const expresionRegular = ConstanteUI.EXPRESIONES_REGULARES_EMAIL;
        return expresionRegular.test(email);
    }


    checkTimeOut() {
        // this.timeoutId = setTimeout(() => this.userInactive.next("mi mensajito"), 10000);
        this.timeoutId = setTimeout(() => this.userInactive.next("mi mensajito"), 1200000);
    }

    iniciarComponent() {
        this.puedeEditar = false
        this.dialog = false
        this.status = 'success'
    }

    esNumero(val) {
        return /^-?\d+$/.test(val);
    }

    formularioFiltrosRestaurar(dto: any) {
        const ss = sessionStorage.getItem(ConstanteAngular.FILTROSESION);
        if (ss !== undefined && ss !== null) {
            const prefiltro = JSON.parse(ss);
            dto = convertDateStringsToDates(prefiltro);
            return dto;
        } else { return dto; }
    }



    flagABoolean(flag: string): boolean {

        if (flag === 'S') {

            return true;

        } else { return false; }

    }

    booleanAFlag(bool: boolean): string {

        if (bool) {

            return 'S';

        } else { return 'N'; }

    }

    tituloListadoAsignarConTitulo(tipo: number, componente: UIMantenimientoController, titulo: string) {
        this.tituloListadoAsignar(tipo, componente);
        this.objetoTitulo.menuSeguridad.titulo = titulo;
    }

    bloquearPagina(): void {

        if (!this.blocked) {
            this.blocked = true;
        }

        this.servicioComun.setBloqueo(this.blocked);
    }

    desbloquearPagina(): void {
        if (this.blocked) { this.blocked = false; }
        this.servicioComun.setBloqueo(this.blocked);

    }

    //TIPOS DE AUDITORIA
    get TIPOSAUDITORIA() {
        return {
            BAS2C: tiposAuditoria.BAS2C
        }
    }

    esEmailValido(email: string): boolean {
        let mailValido = false;
        'use strict'; // modo stricto si no es correctamente usado el metodo devolvera HORRORES

        var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0,9]{1,3}\.[0-9]{1,3}\.[0,9]{1,3}\])|(([a-zA-z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email.match(EMAIL_REGEX)) {
            mailValido = true;
        }
        return mailValido;
    }

    setBloqueo(bloqueo: boolean) {
        this.bloqueoSource.next(bloqueo);
    }

    tituloListadoAsignar(tipo: number, componente: UIMantenimientoController) {
        const ss = sessionStorage.getItem(ConstanteUI.MENUSEGURIDAD);
        if (ss !== undefined && ss != null) {
            const seguridad = JSON.parse(ss) as DtoMenu;
            this.menuSeguridad = seguridad;
            this.objetoTitulo.menuSeguridad = this.menuSeguridad;
        }
        this.objetoTitulo.menuSeguridad = this.menuSeguridad;
        this.objetoTitulo.componente = componente;
        this.objetoTitulo.tipo = tipo;
    }

    asignarAccionLetrasConTitulo(tipo: number, componente: UIMantenimientoController, letra: string, titulo: string) {
        this.asignarAccionLetras(tipo, componente, letra);
        this.objetoTitulo.menuSeguridad.titulo = titulo;
    }

    asignarAccionUiAccionConTitulo(tipo: number, componente: UIMantenimientoController, letra: any, titulo: string) {
        this.asignarAccionUiAccion(tipo, componente, letra);
        this.objetoTitulo.menuSeguridad.titulo = titulo;
    }

    asignarAccionGenericoConTitulo(tipo: number, componente: UIMantenimientoController, letra: any, titulo: string) {
        this.asignarAccionGenerico(tipo, componente, letra);
        this.objetoTitulo.menuSeguridad.titulo = titulo;
    }

    asignarAccionLetras(tipo: number, componente: UIMantenimientoController, letra: string) {
        const ss = sessionStorage.getItem(ConstanteUI.MENUSEGURIDAD);
        if (ss !== undefined && ss != null) {
            const seguridad = JSON.parse(ss) as DtoMenu;
            this.menuSeguridad = seguridad;
            this.objetoTitulo.menuSeguridad = this.menuSeguridad;
        }
        this.objetoTitulo.componente = componente;
        this.objetoTitulo.tipo = tipo;
        if (letra === 'N') {
            this.objetoTitulo.accion = 'Nuevo';
            this.objetoTitulo.puedeEditar = true;
        } else if (letra === 'E' || letra === 'ET') {
            this.objetoTitulo.accion = 'Editar';
            this.objetoTitulo.puedeEditar = true;
        } else if (letra === 'V') {
            this.objetoTitulo.accion = 'Ver';
            this.objetoTitulo.puedeEditar = false;
        }

    }

    asignarAccionUiAccion(tipo: number, componente: UIMantenimientoController, accionsol: any) {
        const ss = sessionStorage.getItem(ConstanteUI.MENUSEGURIDAD);
        if (ss !== undefined && ss != null) {
            const seguridad = JSON.parse(ss) as DtoMenu;
            this.menuSeguridad = seguridad;
            this.objetoTitulo.menuSeguridad = this.menuSeguridad;
        }
        this.objetoTitulo.componente = componente;
        this.objetoTitulo.tipo = tipo;
        if (accionsol === ConstanteUI.ACCION_SOLICITADA_NUEVO) {
            this.objetoTitulo.accion = 'Nuevo';
            this.objetoTitulo.puedeEditar = true;
        } else if (accionsol === ConstanteUI.ACCION_SOLICITADA_EDITAR) {
            this.objetoTitulo.accion = 'Editar';
            this.objetoTitulo.puedeEditar = true;
        } else if (accionsol === ConstanteUI.ACCION_SOLICITADA_VER) {
            this.objetoTitulo.accion = 'Ver';
            this.objetoTitulo.puedeEditar = false;
        }
    }

    asignarAccionGenerico(tipo: number, componente: UIMantenimientoController, acciongen: any) {
        const ss = sessionStorage.getItem(ConstanteUI.MENUSEGURIDAD);
        if (ss !== undefined && ss != null) {
            const seguridad = JSON.parse(ss) as DtoMenu;
            this.menuSeguridad = seguridad;
            this.objetoTitulo.menuSeguridad = this.menuSeguridad;
        }
        this.objetoTitulo.componente = componente;
        this.objetoTitulo.tipo = tipo;
        if (acciongen == "1") {
            this.objetoTitulo.accion = 'Nuevo';
            this.objetoTitulo.puedeEditar = true;
        } else if (acciongen == "2") {
            this.objetoTitulo.accion = 'Editar';
            this.objetoTitulo.puedeEditar = true;
        } else if (acciongen == "3") {
            this.objetoTitulo.accion = 'Ver';
            this.objetoTitulo.puedeEditar = false;
        }

    }

    get ACCIONES() {
        return {
            NUEVO: accionesGlobal.NUEVO,
            EDITAR: accionesGlobal.EDITAR,
            VER: accionesGlobal.VER,
            ELIMINAR: accionesGlobal.ELIMINAR,
            ANULAR: accionesGlobal.ANULAR,
            LISTAR: accionesGlobal.LISTAR,
        };
    }

    esFechaVacia(fecha: Date): boolean {
        if (fecha == null) {
            return true;
        }
        if (fecha == undefined) {
            return true;
        }
        if (fecha.toString() == '') {
            return true;
        }

        return false;
    }


    esListaVacia(lista: any): boolean {
        if (lista == null) {
            return true;
        }
        if (lista == undefined) {
            return true;
        }
        if (lista.length == 0) {
            return true;
        }
        return false;
    }

    estaVacio(cadena: any): boolean {
        if (cadena == null) {
            return true;
        }
        if (cadena == undefined) {
            return true;
        }
        try {
            if (cadena.trim() == '') {
                return true;
            }
        } catch (e) {
            if (cadena == 0) {
                return true;
            }
        }
        return false;
    }

    esNumeroVacio(numero): boolean {
        if (numero == null) {
            return true;
        }
        if (numero === undefined) {
            return true;
        }
        if (String(numero) == '') {
            return true;
        }
        return false;
    }

    esNumeroVacioCero(numero): number {
        if (numero == null) {
            return 0;
        }
        if (numero === undefined) {
            return 0;
        } else {
            return numero
        }
    }



    getMensajeInactivado(value: any): string {
        return 'El Registro Nro. ' + value + ' fue inactivado';
    }

    getMensajeCopiado(value: any): string {
        return 'El Registro Nro. ' + value + ' fue copiado';
    }

    getMensajeGrabado(value: any): string {
        return 'El Registro' + value + ' se guardó con éxito';
    }
    /**metodos agregados por geampier :) */
    getMensajeGuardado(): string {
        return 'Se guardó con éxito';
    }
    getMensajeActualizado(value?: any): string {
        return 'Se actualizó con éxito';
    }
    getMensajeEliminado(): string {
        return 'Se elimino con éxito';
    }
    getMensajeAnulado(): string {
        return 'Se anuló con éxito';
    }
    getMensajeAprobado(): string {
        return 'Se aprobó con éxito';
    }
    getMensajeInactivo(): string {
        return 'Se inactivo con éxito';
    }
    /**:::::::FIN::::::: */
    /**metodos agregados por geampier ::errores */
    getMensajeErrorGuardado(): string {
        return `error al guardar`;
    }
    getMensajeErrorActualizar(): string {
        return `error al actualizar`;
    }
    getMensajeErrorEliminar(): string {
        return 'error al eliminar';
    }
    getMensajeErrorAnular(): string {
        return 'error al anular';
    }
    getMensajeErrorAprobar(): string {
        return 'error al aprobar';
    }
    getMensajeErrorinactivar(): string {
        return 'error al inactivar';
    }
    /**:::::::FIN::::::: */
    
    getMensajeAlerta(value: any): string {
        return value + ' con las opciones dadas ';
    }
    getMensajeErrorRegistro(value: any): string {
        return `error al registrar ${value}`;
    }
    getMensajeErrorEditar(value: any): string {
        return `error al actualizar`;
    }

    getUsuarioAuth(): UsuarioAuth {
        let userStorage = JSON.parse(sessionStorage.getItem('access_user'))
        return this.usuarioAuth = userStorage;
    }


    getUsuarioToken(): any {
        let userStorage = JSON.parse(sessionStorage.getItem('access_user_token'))
        return userStorage;
    }

    getMiscelaneos(): Miscelaneos[] {
        var miscelaneosListStorage = JSON.parse(sessionStorage.getItem('access_miscelaneos'))
        return this.lstmiscelaneos = miscelaneosListStorage;
    }

    getParametros(): Miscelaneos[] {
        var ParametrosListStorage = JSON.parse(sessionStorage.getItem('access_Parametros'))
        return this.lstparametros = ParametrosListStorage;
    }


    getIp(): string {
        var ipStorage = JSON.parse(sessionStorage.getItem('access_ip'))
        return ipStorage;
    }

    cargarModel(bean: any): any {
        const array = Array.isArray(bean) ? bean : [bean]
        return array.reduce((acc, el) => {
            let beans = Object.assign({}, el)
            return beans
        }, {})
    }

    cargarModelArrayNodo(bean: any): any {
        const array = Array.isArray(bean) ? bean : [bean]
        return array.reduce((acc, el) => {

            acc.push(this.cargarModel(el))
            if (!this.esListaVacia(el.children)) {
                this.cargarModelArrayNodo(el.children)
            }
            return acc
        }, [])
    }

    circularNodo(nodo: any): any {

        var result = JSON.stringify(nodo, (function () {
            var stack = [];
            return function (key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (stack.indexOf(value) !== -1) {
                        return undefined;
                    }
                    stack.push(value);
                }
                return value;
            };
        })());

        let dtoCircular = JSON.parse(result)

        return dtoCircular
    }


    destroyByClick = true;
    duration = 2000;
    hasIcon = true;
    positions: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
    preventDuplicates = false;

    showToast(type: NbComponentStatus): any {
        const config = {
            status: type,
            destroyByClick: this.destroyByClick,
            duration: this.duration,
            hasIcon: this.hasIcon,
            position: this.positions,
            preventDuplicates: this.preventDuplicates,
        };
        return config
    }

    toastMensaje(title: string, icon: SweetAlertIcon, timer: number) {

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: timer,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: icon,
            title: title
        })
    }

    tick(_confirmationService: ConfirmationService, _router: Router, _loginService: LoginService): void {
        _confirmationService.confirm({

            header: "¡Aviso!", icon: "fa fa-question-circle", message: `Quedan ${this.segundos} segundos para finalizar sesión.`,

            accept: () => {

                this.segundos = 30;
                clearInterval(this.IdTimer)
                this.nuevoToken(_loginService);//metodo
            },
            reject: () => {

                clearInterval(this.IdTimer)
                this.userInactive.unsubscribe();
                sessionStorage.removeItem('access_user_token')
                sessionStorage.removeItem('access_user')
                sessionStorage.removeItem('access_menu')
                _router.navigate(['/auth/login'])

            },

            key: "confirm",
        });

        if (--this.segundos < 1) {
            clearInterval(this.IdTimer)
            this.userInactive.unsubscribe();
            sessionStorage.removeItem('access_user_token')
            sessionStorage.removeItem('access_user')
            sessionStorage.removeItem('access_menu')
            _router.navigate(['/auth/login'])

        }
    }

    nuevoToken(loginService: LoginService) {
        var login
        login = {
            Usuario: this.getUsuarioAuth().data[0].Usuario.trim(),
            Clave: CryptoJS.AES.decrypt(this.getUsuarioAuth().encPass, atob(this.getUsuarioAuth().encCon)).toString(CryptoJS.enc.Utf8),
            IdSede: this.getUsuarioAuth().data[0].IdSede
        }
        console.log("login", login)
        return loginService.login2(login).then(
            res => {
                if (res.success) {
                    // console.log("Token del RES", res.tokem);
                    console.log("Token del antes", this.getUsuarioToken());

                    sessionStorage.setItem('access_user_token', JSON.stringify(res.tokem));
                    console.log("tokem despues", this.getUsuarioToken())
                    // this.getUsuarioAuth().tokem = res.tokem;
                    // console.log("Token del RES", res.tokem);
                    // console.log("Token del antes reemplazado por el RES", this.getUsuarioToken());


                } else {
                    // console.log("login ops:::::Usuario y/o clave incorrectos", res);

                }
            }
        )
    }

    redondearNumero(numero, decimales) {
        if (typeof numero != 'number' || typeof decimales != 'number') {
            return null;
        }
        //si numero es mayor o igual a 0 en ese caso dejamos 1 en caso contrario dejamos -1
        let signo = numero >= 0 ? 1 : -1;
        //redondeamos el valor de numero multiplicandolo por la potencia de 10 a la cantidad de decimales a esto le sumamos el producto de signo * 0.0001 y todo eso lo dividimos entre la potencia de 10 a la cantidad de decimales, ultimo invocamos tofixed y le pasamos como argumento decimales
        return (Math.round((numero * Math.pow(10, decimales)) + (signo * 0.0001)) / Math.pow(10, decimales)).toFixed(decimales);
    }


}

//TIPOS DE AUDITORIA
export enum tiposAuditoria {
    BAS2C = "BAS2C",
}




